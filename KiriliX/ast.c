#include "ast.h"
#include <stdlib.h>
#include <string.h>

static ASTNode* alloc_node(NodeType type) {
    ASTNode* node = (ASTNode*)malloc(sizeof(ASTNode));
    node->type = type;
    return node;
}

ASTNode* create_int_node(int val) {
    ASTNode* node = alloc_node(NODE_INT_LITERAL);
    node->as.val.type = VAL_INT;
    node->as.val.data.i = val;
    return node;
}

ASTNode* create_float_node(float val) {
    ASTNode* node = alloc_node(NODE_FLOAT_LITERAL);
    node->as.val.type = VAL_FLOAT;
    node->as.val.data.f = val;
    return node;
}

ASTNode* create_string_node(const char* val) {
    ASTNode* node = alloc_node(NODE_STRING_LITERAL);
    node->as.val.type = VAL_STRING;
    node->as.val.data.str = strdup(val);
    return node;
}

ASTNode* create_bool_node(bool val) {
    ASTNode* node = alloc_node(NODE_BOOL_LITERAL);
    node->as.val.type = VAL_BOOL;
    node->as.val.data.b = val;
    return node;
}

ASTNode* create_char_node(char val) {
    ASTNode* node = alloc_node(NODE_CHAR_LITERAL);
    node->as.val.type = VAL_CHAR;
    node->as.val.data.c = val;
    return node;
}

ASTNode* create_null_node() {
    ASTNode* node = alloc_node(NODE_NULL_LITERAL);
    node->as.val.type = VAL_NULL;
    return node;
}

ASTNode* create_var_access(const char* name) {
    ASTNode* node = alloc_node(NODE_VAR_ACCESS);
    node->as.var_name = strdup(name);
    return node;
}

ASTNode* create_var_decl(ValueType type, const char* name, ASTNode* init) {
    ASTNode* node = alloc_node(NODE_VAR_DECLARATION);
    node->as.var_decl.var_type = type;
    node->as.var_decl.name = strdup(name);
    node->as.var_decl.initial_value = init;
    return node;
}

ASTNode* create_assign(const char* name, ASTNode* expr) {
    ASTNode* node = alloc_node(NODE_ASSIGN);
    node->as.assign.name = strdup(name);
    node->as.assign.expr = expr;
    return node;
}

ASTNode* create_array_literal(ASTNode** elements, int count) {
    ASTNode* node = alloc_node(NODE_ARRAY_LITERAL);
    node->as.array_literal.elements = elements; 
    node->as.array_literal.count = count;
    return node;
}

ASTNode* create_array_access(ASTNode* arr, ASTNode* index) {
    ASTNode* node = alloc_node(NODE_ARRAY_ACCESS);
    node->as.array_access.array_expr = arr;
    node->as.array_access.index_expr = index;
    return node;
}

ASTNode* create_array_assign(ASTNode* arr, ASTNode* index, ASTNode* value) {
    ASTNode* node = alloc_node(NODE_ARRAY_ASSIGN);
    node->as.array_assign.array_expr = arr;
    node->as.array_assign.index_expr = index;
    node->as.array_assign.value_expr = value;
    return node;
}

ASTNode* create_binop(OperatorType op, ASTNode* left, ASTNode* right) {
    ASTNode* node = alloc_node(NODE_BINOP);
    node->as.binop.op = op;
    node->as.binop.left = left;
    node->as.binop.right = right;
    return node;
}

ASTNode* create_if(ASTNode* cond, ASTNode* if_body, ASTNode* else_body) {
    ASTNode* node = alloc_node(NODE_IF);
    node->as.if_stmt.condition = cond;
    node->as.if_stmt.if_body = if_body;
    node->as.if_stmt.else_body = else_body;
    return node;
}

ASTNode* create_while(ASTNode* cond, ASTNode* body) {
    ASTNode* node = alloc_node(NODE_WHILE);
    node->as.while_stmt.condition = cond;
    node->as.while_stmt.body = body;
    return node;
}

ASTNode* create_for(ASTNode* init, ASTNode* cond, ASTNode* update, ASTNode* body) {
    ASTNode* node = alloc_node(NODE_FOR);
    node->as.for_stmt.init = init;
    node->as.for_stmt.condition = cond;
    node->as.for_stmt.update = update;
    node->as.for_stmt.body = body;
    return node;
}

ASTNode* create_block() {
    ASTNode* node = alloc_node(NODE_BLOCK);
    node->as.block.statements = NULL;
    node->as.block.count = 0;
    node->as.block.capacity = 0;
    return node;
}

void block_add_stmt(ASTNode* block, ASTNode* stmt) {
    if (block->type != NODE_BLOCK) return;
    if (block->as.block.count >= block->as.block.capacity) {
        block->as.block.capacity = block->as.block.capacity == 0 ? 4 : block->as.block.capacity * 2;
        block->as.block.statements = (ASTNode**)realloc(block->as.block.statements, block->as.block.capacity * sizeof(ASTNode*));
    }
    block->as.block.statements[block->as.block.count++] = stmt;
}

ASTNode* create_func_decl(ValueType ret_type, const char* name, int p_count, char** p_names, ValueType* p_types, ASTNode* body) {
    ASTNode* node = alloc_node(NODE_FUNC_DECL);
    node->as.func_decl.return_type = ret_type;
    node->as.func_decl.name = strdup(name);
    node->as.func_decl.param_count = p_count;
    node->as.func_decl.param_names = p_names; 
    node->as.func_decl.param_types = p_types; 
    node->as.func_decl.body = body;
    return node;
}

ASTNode* create_func_call(const char* name, int arg_count, ASTNode** args) {
    ASTNode* node = alloc_node(NODE_FUNC_CALL);
    node->as.func_call.name = strdup(name);
    node->as.func_call.arg_count = arg_count;
    node->as.func_call.args = args; 
    return node;
}

ASTNode* create_return(ASTNode* expr) {
    ASTNode* node = alloc_node(NODE_RETURN);
    node->as.ret_expr = expr;
    return node;
}

ASTNode* create_print(ASTNode* expr) {
    ASTNode* node = alloc_node(NODE_PRINT);
    node->as.print_expr = expr;
    return node;
}

void free_ast(ASTNode* node) {
    if (!node) return;
    
    switch (node->type) {
        case NODE_STRING_LITERAL:
            free(node->as.val.data.str);
            break;
        case NODE_VAR_ACCESS:
            free(node->as.var_name);
            break;
        case NODE_VAR_DECLARATION:
            free(node->as.var_decl.name);
            free_ast(node->as.var_decl.initial_value);
            break;
        case NODE_ASSIGN:
            free(node->as.assign.name);
            free_ast(node->as.assign.expr);
            break;
        case NODE_ARRAY_LITERAL:
            for (int i = 0; i < node->as.array_literal.count; i++) {
                free_ast(node->as.array_literal.elements[i]);
            }
            if (node->as.array_literal.elements) free(node->as.array_literal.elements);
            break;
        case NODE_ARRAY_ACCESS:
            free_ast(node->as.array_access.array_expr);
            free_ast(node->as.array_access.index_expr);
            break;
        case NODE_ARRAY_ASSIGN:
            free_ast(node->as.array_assign.array_expr);
            free_ast(node->as.array_assign.index_expr);
            free_ast(node->as.array_assign.value_expr);
            break;
        case NODE_BINOP:
            free_ast(node->as.binop.left);
            free_ast(node->as.binop.right);
            break;
        case NODE_UNOP:
            free_ast(node->as.unop.operand);
            break;
        case NODE_IF:
            free_ast(node->as.if_stmt.condition);
            free_ast(node->as.if_stmt.if_body);
            free_ast(node->as.if_stmt.else_body);
            break;
        case NODE_WHILE:
            free_ast(node->as.while_stmt.condition);
            free_ast(node->as.while_stmt.body);
            break;
        case NODE_FOR:
            free_ast(node->as.for_stmt.init);
            free_ast(node->as.for_stmt.condition);
            free_ast(node->as.for_stmt.update);
            free_ast(node->as.for_stmt.body);
            break;
        case NODE_BLOCK:
            for (int i = 0; i < node->as.block.count; i++) {
                free_ast(node->as.block.statements[i]);
            }
            free(node->as.block.statements);
            break;
        case NODE_FUNC_DECL:
            free(node->as.func_decl.name);
            for (int i = 0; i < node->as.func_decl.param_count; i++) {
                free(node->as.func_decl.param_names[i]);
            }
            if (node->as.func_decl.param_names) free(node->as.func_decl.param_names);
            if (node->as.func_decl.param_types) free(node->as.func_decl.param_types);
            free_ast(node->as.func_decl.body);
            break;
        case NODE_FUNC_CALL:
            free(node->as.func_call.name);
            for (int i = 0; i < node->as.func_call.arg_count; i++) {
                free_ast(node->as.func_call.args[i]);
            }
            if (node->as.func_call.args) free(node->as.func_call.args);
            break;
        case NODE_RETURN:
            free_ast(node->as.ret_expr);
            break;
        case NODE_PRINT:
            free_ast(node->as.print_expr);
            break;
        default:
            break;
    }
    free(node);
}
