// src/parser/ast.c
#include "ast.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

static ASTNode* create_node(NodeType type, int line, int column) {
    ASTNode* node = malloc(sizeof(ASTNode));
    node->type = type;
    node->line = line;
    node->column = column;
    node->next = NULL;
    memset(&node->data, 0, sizeof(node->data));
    return node;
}

ASTNode* create_program(ASTNode* statements) {
    ASTNode* node = create_node(NODE_PROGRAM, 0, 0);
    node->next = statements;
    return node;
}

ASTNode* create_variable_decl(char* name, ASTNode* value, int line, int column) {
    ASTNode* node = create_node(NODE_VARIABLE_DECL, line, column);
    node->data.var_decl.name = strdup(name);
    node->data.var_decl.value = value;
    node->data.var_decl.var_type = 0;
    free(name);
    return node;
}

ASTNode* create_typed_variable_decl(char* name, int type, ASTNode* value, int line, int column) {
    ASTNode* node = create_node(NODE_VARIABLE_DECL_TYPED, line, column);
    node->data.var_decl.name = strdup(name);
    node->data.var_decl.var_type = type;
    node->data.var_decl.value = value;
    free(name);
    return node;
}

ASTNode* create_assignment(char* name, ASTNode* value, int line, int column) {
    ASTNode* node = create_node(NODE_ASSIGNMENT, line, column);
    node->data.assignment.name = strdup(name);
    node->data.assignment.value = value;
    free(name);
    return node;
}

ASTNode* create_compound_assignment(char* name, int op, ASTNode* value, int line, int column) {
    ASTNode* node = create_node(NODE_COMPOUND_ASSIGNMENT, line, column);
    node->data.compound_assignment.name = strdup(name);
    node->data.compound_assignment.op = op;
    node->data.compound_assignment.value = value;
    free(name);
    return node;
}

ASTNode* create_increment(char* name, int line, int column) {
    ASTNode* node = create_node(NODE_INCREMENT, line, column);
    node->data.assignment.name = strdup(name);
    free(name);
    return node;
}

ASTNode* create_decrement(char* name, int line, int column) {
    ASTNode* node = create_node(NODE_DECREMENT, line, column);
    node->data.assignment.name = strdup(name);
    free(name);
    return node;
}

ASTNode* create_binary_op(int op, ASTNode* left, ASTNode* right, int line, int column) {
    ASTNode* node = create_node(NODE_BINARY_OP, line, column);
    node->data.binary_op.op = op;
    node->data.binary_op.left = left;
    node->data.binary_op.right = right;
    return node;
}

ASTNode* create_unary_op(int op, ASTNode* operand, int line, int column) {
    ASTNode* node = create_node(NODE_UNARY_OP, line, column);
    node->data.unary_op.op = op;
    node->data.unary_op.operand = operand;
    return node;
}

ASTNode* create_ternary(ASTNode* condition, ASTNode* then_expr, ASTNode* else_expr, int line, int column) {
    ASTNode* node = create_node(NODE_TERNARY, line, column);
    node->data.ternary.condition = condition;
    node->data.ternary.then_expr = then_expr;
    node->data.ternary.else_expr = else_expr;
    return node;
}

ASTNode* create_literal(Value value, int line, int column) {
    ASTNode* node = create_node(NODE_LITERAL, line, column);
    node->data.value = value;
    return node;
}

ASTNode* create_identifier(char* name, int line, int column) {
    ASTNode* node = create_node(NODE_IDENTIFIER, line, column);
    node->data.name = strdup(name);
    free(name);
    return node;
}

ASTNode* create_if(ASTNode* condition, ASTNode* then_branch, ASTNode* else_branch, int line, int column) {
    ASTNode* node = create_node(NODE_IF, line, column);
    node->data.if_stmt.condition = condition;
    node->data.if_stmt.then_branch = then_branch;
    node->data.if_stmt.else_branch = else_branch;
    return node;
}

ASTNode* create_while(ASTNode* condition, ASTNode* body, int line, int column) {
    ASTNode* node = create_node(NODE_WHILE, line, column);
    node->data.while_loop.condition = condition;
    node->data.while_loop.body = body;
    return node;
}

ASTNode* create_for(ASTNode* initializer, ASTNode* condition, ASTNode* increment, ASTNode* body, int line, int column) {
    ASTNode* node = create_node(NODE_FOR, line, column);
    node->data.for_loop.initializer = initializer;
    node->data.for_loop.condition = condition;
    node->data.for_loop.increment = increment;
    node->data.for_loop.body = body;
    return node;
}

ASTNode* create_foreach(char* var_name, ASTNode* collection, ASTNode* body, int line, int column) {
    ASTNode* node = create_node(NODE_FOREACH, line, column);
    node->data.foreach_loop.var_name = strdup(var_name);
    node->data.foreach_loop.collection = collection;
    node->data.foreach_loop.body = body;
    free(var_name);
    return node;
}

ASTNode* create_function_def(char* name, char** params, int param_count, ASTNode* body, int return_type, int line, int column) {
    ASTNode* node = create_node(NODE_FUNCTION_DEF, line, column);
    node->data.function_def.name = strdup(name);
    node->data.function_def.params = params;
    node->data.function_def.param_count = param_count;
    node->data.function_def.body = body;
    node->data.function_def.return_type = return_type;
    free(name);
    return node;
}

ASTNode* create_function_call(char* name, ASTNode** args, int arg_count, int line, int column) {
    ASTNode* node = create_node(NODE_FUNCTION_CALL, line, column);
    node->data.function_call.name = strdup(name);
    node->data.function_call.args = args;
    node->data.function_call.arg_count = arg_count;
    free(name);
    return node;
}

ASTNode* create_return(ASTNode* value, int line, int column) {
    ASTNode* node = create_node(NODE_RETURN, line, column);
    node->data.assignment.value = value;
    return node;
}

ASTNode* create_block(ASTNode** statements, int statement_count, int line, int column) {
    ASTNode* node = create_node(NODE_BLOCK, line, column);
    node->data.block.statements = statements;
    node->data.block.statement_count = statement_count;
    return node;
}

ASTNode* create_print(ASTNode** expressions, int expr_count, int line, int column) {
    ASTNode* node = create_node(NODE_PRINT, line, column);
    node->data.print_stmt.expressions = expressions;
    node->data.print_stmt.expr_count = expr_count;
    return node;
}

ASTNode* create_read(char* prompt, int line, int column) {
    ASTNode* node = create_node(NODE_READ, line, column);
    node->data.assignment.name = prompt ? strdup(prompt) : NULL;
    if (prompt) free(prompt);
    return node;
}

ASTNode* create_array(ASTNode** elements, int element_count, int line, int column) {
    ASTNode* node = create_node(NODE_ARRAY, line, column);
    node->data.array.elements = elements;
    node->data.array.element_count = element_count;
    return node;
}

ASTNode* create_array_access(char* name, ASTNode* index, int line, int column) {
    ASTNode* node = create_node(NODE_ARRAY_ACCESS, line, column);
    node->data.array_access.name = strdup(name);
    node->data.array_access.index = index;
    free(name);
    return node;
}

ASTNode* create_array_assignment(char* name, ASTNode* index, ASTNode* value, int line, int column) {
    ASTNode* node = create_node(NODE_ARRAY_ASSIGNMENT, line, column);
    node->data.array_access.name = strdup(name);
    node->data.array_access.index = index;
    node->data.assignment.value = value;
    free(name);
    return node;
}

ASTNode* create_type_cast(int target_type, ASTNode* expression, int line, int column) {
    ASTNode* node = create_node(NODE_TYPE_CAST, line, column);
    node->data.type_cast.target_type = target_type;
    node->data.type_cast.expression = expression;
    return node;
}

ASTNode* create_break(int line, int column) {
    return create_node(NODE_BREAK, line, column);
}

ASTNode* create_continue(int line, int column) {
    return create_node(NODE_CONTINUE, line, column);
}

ASTNode* create_range(ASTNode* start, ASTNode* end, ASTNode* step, int line, int column) {
    ASTNode* node = create_node(NODE_RANGE, line, column);
    node->data.range.start = start;
    node->data.range.end = end;
    node->data.range.step = step;
    return node;
}

ASTNode* create_sizeof(ASTNode* expression, int line, int column) {
    ASTNode* node = create_node(NODE_SIZEOF, line, column);
    node->data.sizeof_expr.expression = expression;
    return node;
}

ASTNode* create_block_from_list(ASTNode* stmt_list, int line, int column) {
    // Count statements
    int count = 0;
    ASTNode* current = stmt_list;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    
    // Allocate array
    ASTNode** statements = malloc(sizeof(ASTNode*) * count);
    current = stmt_list;
    for (int i = 0; i < count; i++) {
        statements[i] = current;
        ASTNode* next = current->next;
        current->next = NULL; // Break the linked list
        current = next;
    }
    
    return create_block(statements, count, line, column);
}

void free_ast(ASTNode* node) {
    if (node == NULL) return;
    
    // Free linked list first
    if (node->next) {
        free_ast(node->next);
        node->next = NULL;
    }
    
    // Free node data based on type
    switch (node->type) {
        case NODE_BINARY_OP:
            free_ast(node->data.binary_op.left);
            free_ast(node->data.binary_op.right);
            break;
            
        case NODE_UNARY_OP:
            free_ast(node->data.unary_op.operand);
            break;
            
        case NODE_TERNARY:
            free_ast(node->data.ternary.condition);
            free_ast(node->data.ternary.then_expr);
            free_ast(node->data.ternary.else_expr);
            break;
            
        case NODE_VARIABLE_DECL:
        case NODE_VARIABLE_DECL_TYPED:
            free(node->data.var_decl.name);
            free_ast(node->data.var_decl.value);
            break;
            
        case NODE_ASSIGNMENT:
            free(node->data.assignment.name);
            free_ast(node->data.assignment.value);
            break;
            
        case NODE_COMPOUND_ASSIGNMENT:
            free(node->data.compound_assignment.name);
            free_ast(node->data.compound_assignment.value);
            break;
            
        case NODE_INCREMENT:
        case NODE_DECREMENT:
            free(node->data.assignment.name);
            break;
            
        case NODE_IDENTIFIER:
            free(node->data.name);
            break;
            
        case NODE_IF:
            free_ast(node->data.if_stmt.condition);
            free_ast(node->data.if_stmt.then_branch);
            free_ast(node->data.if_stmt.else_branch);
            break;
            
        case NODE_WHILE:
            free_ast(node->data.while_loop.condition);
            free_ast(node->data.while_loop.body);
            break;
            
        case NODE_FOR:
            free_ast(node->data.for_loop.initializer);
            free_ast(node->data.for_loop.condition);
            free_ast(node->data.for_loop.increment);
            free_ast(node->data.for_loop.body);
            break;
            
        case NODE_FOREACH:
            free(node->data.foreach_loop.var_name);
            free_ast(node->data.foreach_loop.collection);
            free_ast(node->data.foreach_loop.body);
            break;
            
        case NODE_FUNCTION_DEF:
            free(node->data.function_def.name);
            if (node->data.function_def.params) {
                for (int i = 0; i < node->data.function_def.param_count; i++) {
                    free(node->data.function_def.params[i]);
                }
                free(node->data.function_def.params);
            }
            free_ast(node->data.function_def.body);
            break;
            
        case NODE_FUNCTION_CALL:
            free(node->data.function_call.name);
            if (node->data.function_call.args) {
                for (int i = 0; i < node->data.function_call.arg_count; i++) {
                    free_ast(node->data.function_call.args[i]);
                }
                free(node->data.function_call.args);
            }
            break;
            
        case NODE_RETURN:
            if (node->data.assignment.value) {
                free_ast(node->data.assignment.value);
            }
            break;
            
        case NODE_BLOCK:
            if (node->data.block.statements) {
                for (int i = 0; i < node->data.block.statement_count; i++) {
                    free_ast(node->data.block.statements[i]);
                }
                free(node->data.block.statements);
            }
            break;
            
        case NODE_PRINT:
            if (node->data.print_stmt.expressions) {
                for (int i = 0; i < node->data.print_stmt.expr_count; i++) {
                    free_ast(node->data.print_stmt.expressions[i]);
                }
                free(node->data.print_stmt.expressions);
            }
            break;
            
        case NODE_READ:
            if (node->data.assignment.name) {
                free(node->data.assignment.name);
            }
            break;
            
        case NODE_ARRAY:
            if (node->data.array.elements) {
                for (int i = 0; i < node->data.array.element_count; i++) {
                    free_ast(node->data.array.elements[i]);
                }
                free(node->data.array.elements);
            }
            break;
            
        case NODE_ARRAY_ACCESS:
            free(node->data.array_access.name);
            free_ast(node->data.array_access.index);
            break;
            
        case NODE_ARRAY_ASSIGNMENT:
            free(node->data.array_access.name);
            free_ast(node->data.array_access.index);
            free_ast(node->data.assignment.value);
            break;
            
        case NODE_TYPE_CAST:
            free_ast(node->data.type_cast.expression);
            break;
            
        case NODE_RANGE:
            free_ast(node->data.range.start);
            free_ast(node->data.range.end);
            if (node->data.range.step) {
                free_ast(node->data.range.step);
            }
            break;
            
        case NODE_SIZEOF:
            free_ast(node->data.sizeof_expr.expression);
            break;
            
        case NODE_LITERAL:
            free_value(node->data.value);
            break;
            
        default:
            break;
    }
    
    free(node);
}

const char* node_type_to_string(NodeType type) {
    switch (type) {
        case NODE_PROGRAM: return "PROGRAM";
        case NODE_VARIABLE_DECL: return "VAR_DECL";
        case NODE_VARIABLE_DECL_TYPED: return "VAR_DECL_TYPED";
        case NODE_ASSIGNMENT: return "ASSIGNMENT";
        case NODE_COMPOUND_ASSIGNMENT: return "COMPOUND_ASSIGNMENT";
        case NODE_INCREMENT: return "INCREMENT";
        case NODE_DECREMENT: return "DECREMENT";
        case NODE_BINARY_OP: return "BINARY_OP";
        case NODE_UNARY_OP: return "UNARY_OP";
        case NODE_TERNARY: return "TERNARY";
        case NODE_LITERAL: return "LITERAL";
        case NODE_IDENTIFIER: return "IDENTIFIER";
        case NODE_IF: return "IF";
        case NODE_WHILE: return "WHILE";
        case NODE_FOR: return "FOR";
        case NODE_FOREACH: return "FOREACH";
        case NODE_FUNCTION_DEF: return "FUNCTION_DEF";
        case NODE_FUNCTION_CALL: return "FUNCTION_CALL";
        case NODE_RETURN: return "RETURN";
        case NODE_BLOCK: return "BLOCK";
        case NODE_PRINT: return "PRINT";
        case NODE_READ: return "READ";
        case NODE_ARRAY: return "ARRAY";
        case NODE_ARRAY_ACCESS: return "ARRAY_ACCESS";
        case NODE_ARRAY_ASSIGNMENT: return "ARRAY_ASSIGNMENT";
        case NODE_TYPE_CAST: return "TYPE_CAST";
        case NODE_BREAK: return "BREAK";
        case NODE_CONTINUE: return "CONTINUE";
        case NODE_RANGE: return "RANGE";
        case NODE_SIZEOF: return "SIZEOF";
        default: return "UNKNOWN";
    }
}

void print_ast(ASTNode* node, int indent) {
    if (node == NULL) return;
    
    for (int i = 0; i < indent; i++) printf("  ");
    
    printf("%s", node_type_to_string(node->type));
    
    switch (node->type) {
        case NODE_IDENTIFIER:
            printf(" (%s)", node->data.name);
            break;
        case NODE_LITERAL: {
            char* str = value_to_string(node->data.value);
            printf(" (%s)", str);
            free(str);
            break;
        }
        case NODE_BINARY_OP:
            printf(" (op: %d)", node->data.binary_op.op);
            break;
        case NODE_VARIABLE_DECL:
            printf(" (name: %s)", node->data.var_decl.name);
            break;
        case NODE_FUNCTION_DEF:
            printf(" (name: %s, params: %d)", node->data.function_def.name, node->data.function_def.param_count);
            break;
        default:
            break;
    }
    
    printf("\n");
    
    // Recursively print children
    switch (node->type) {
        case NODE_BINARY_OP:
            print_ast(node->data.binary_op.left, indent + 1);
            print_ast(node->data.binary_op.right, indent + 1);
            break;
        case NODE_UNARY_OP:
            print_ast(node->data.unary_op.operand, indent + 1);
            break;
        case NODE_TERNARY:
            print_ast(node->data.ternary.condition, indent + 1);
            print_ast(node->data.ternary.then_expr, indent + 1);
            print_ast(node->data.ternary.else_expr, indent + 1);
            break;
        case NODE_VARIABLE_DECL:
        case NODE_VARIABLE_DECL_TYPED:
            print_ast(node->data.var_decl.value, indent + 1);
            break;
        case NODE_ASSIGNMENT:
        case NODE_COMPOUND_ASSIGNMENT:
            print_ast(node->data.assignment.value, indent + 1);
            break;
        case NODE_IF:
            print_ast(node->data.if_stmt.condition, indent + 1);
            print_ast(node->data.if_stmt.then_branch, indent + 1);
            if (node->data.if_stmt.else_branch) {
                print_ast(node->data.if_stmt.else_branch, indent + 1);
            }
            break;
        case NODE_WHILE:
            print_ast(node->data.while_loop.condition, indent + 1);
            print_ast(node->data.while_loop.body, indent + 1);
            break;
        case NODE_FOR:
            print_ast(node->data.for_loop.initializer, indent + 1);
            print_ast(node->data.for_loop.condition, indent + 1);
            print_ast(node->data.for_loop.increment, indent + 1);
            print_ast(node->data.for_loop.body, indent + 1);
            break;
        case NODE_FOREACH:
            print_ast(node->data.foreach_loop.collection, indent + 1);
            print_ast(node->data.foreach_loop.body, indent + 1);
            break;
        case NODE_FUNCTION_DEF:
            print_ast(node->data.function_def.body, indent + 1);
            break;
        case NODE_FUNCTION_CALL:
            for (int i = 0; i < node->data.function_call.arg_count; i++) {
                print_ast(node->data.function_call.args[i], indent + 1);
            }
            break;
        case NODE_RETURN:
            if (node->data.assignment.value) {
                print_ast(node->data.assignment.value, indent + 1);
            }
            break;
        case NODE_BLOCK:
            for (int i = 0; i < node->data.block.statement_count; i++) {
                print_ast(node->data.block.statements[i], indent + 1);
            }
            break;
        case NODE_PRINT:
            for (int i = 0; i < node->data.print_stmt.expr_count; i++) {
                print_ast(node->data.print_stmt.expressions[i], indent + 1);
            }
            break;
        case NODE_ARRAY:
            for (int i = 0; i < node->data.array.element_count; i++) {
                print_ast(node->data.array.elements[i], indent + 1);
            }
            break;
        case NODE_ARRAY_ACCESS:
            print_ast(node->data.array_access.index, indent + 1);
            break;
        case NODE_ARRAY_ASSIGNMENT:
            print_ast(node->data.array_access.index, indent + 1);
            print_ast(node->data.assignment.value, indent + 1);
            break;
        case NODE_TYPE_CAST:
            print_ast(node->data.type_cast.expression, indent + 1);
            break;
        case NODE_RANGE:
            print_ast(node->data.range.start, indent + 1);
            print_ast(node->data.range.end, indent + 1);
            if (node->data.range.step) {
                print_ast(node->data.range.step, indent + 1);
            }
            break;
        case NODE_SIZEOF:
            print_ast(node->data.sizeof_expr.expression, indent + 1);
            break;
        default:
            break;
    }
    
    if (node->next) {
        print_ast(node->next, indent);
    }
}