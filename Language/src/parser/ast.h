// src/parser/ast.h
#ifndef AST_H
#define AST_H

#include "../runtime/value.h"

typedef enum {
    NODE_PROGRAM,
    NODE_VARIABLE_DECL,
    NODE_VARIABLE_DECL_TYPED,
    NODE_ASSIGNMENT,
    NODE_COMPOUND_ASSIGNMENT,
    NODE_INCREMENT,
    NODE_DECREMENT,
    NODE_BINARY_OP,
    NODE_UNARY_OP,
    NODE_LITERAL,
    NODE_IDENTIFIER,
    NODE_IF,
    NODE_WHILE,
    NODE_FOR,
    NODE_FOREACH,
    NODE_FUNCTION_DEF,
    NODE_FUNCTION_CALL,
    NODE_RETURN,
    NODE_BLOCK,
    NODE_PRINT,
    NODE_READ,
    NODE_ARRAY,
    NODE_ARRAY_ACCESS,
    NODE_ARRAY_ASSIGNMENT,
    NODE_TYPE_CAST,
    NODE_BREAK,
    NODE_CONTINUE,
    NODE_TERNARY,
    NODE_SIZEOF,
    NODE_RANGE
} NodeType;

typedef struct ASTNode {
    NodeType type;
    int line;
    int column;
    
    union {
        // For literals
        Value value;
        
        // For identifiers
        char* name;
        
        // For binary operators
        struct {
            int op; // Token type
            struct ASTNode* left;
            struct ASTNode* right;
        } binary_op;
        
        // For unary operators
        struct {
            int op;
            struct ASTNode* operand;
        } unary_op;
        
        // For ternary operator
        struct {
            struct ASTNode* condition;
            struct ASTNode* then_expr;
            struct ASTNode* else_expr;
        } ternary;
        
        // For control structures
        struct {
            struct ASTNode* condition;
            struct ASTNode* then_branch;
            struct ASTNode* else_branch;
        } if_stmt;
        
        struct {
            struct ASTNode* condition;
            struct ASTNode* body;
        } while_loop;
        
        struct {
            struct ASTNode* initializer;
            struct ASTNode* condition;
            struct ASTNode* increment;
            struct ASTNode* body;
        } for_loop;
        
        struct {
            char* var_name;
            struct ASTNode* collection;
            struct ASTNode* body;
        } foreach_loop;
        
        // For function definition
        struct {
            char* name;
            char** params;
            int param_count;
            struct ASTNode* body;
            int return_type; // Token type for type
        } function_def;
        
        // For function call
        struct {
            char* name;
            struct ASTNode** args;
            int arg_count;
        } function_call;
        
        // For variable declaration
        struct {
            char* name;
            struct ASTNode* value;
            int var_type; // Token type for type (0 if not typed)
        } var_decl;
        
        // For assignment
        struct {
            char* name;
            struct ASTNode* value;
        } assignment;
        
        // For compound assignment (+=, -=, etc.)
        struct {
            char* name;
            int op; // +, -, *, etc.
            struct ASTNode* value;
        } compound_assignment;
        
        // For array
        struct {
            struct ASTNode** elements;
            int element_count;
        } array;
        
        // For array access
        struct {
            char* name;
            struct ASTNode* index;
        } array_access;
        
        // For type cast
        struct {
            int target_type;
            struct ASTNode* expression;
        } type_cast;
        
        // For block
        struct {
            struct ASTNode** statements;
            int statement_count;
        } block;
        
        // For print statement
        struct {
            struct ASTNode** expressions;
            int expr_count;
        } print_stmt;
        
        // For range (1..10)
        struct {
            struct ASTNode* start;
            struct ASTNode* end;
            struct ASTNode* step;
        } range;
        
        // For sizeof
        struct {
            struct ASTNode* expression;
        } sizeof_expr;
    } data;
    
    struct ASTNode* next; // For linked list in blocks
} ASTNode;

// AST creation functions
ASTNode* create_program(ASTNode* statements);
ASTNode* create_variable_decl(char* name, ASTNode* value, int line, int column);
ASTNode* create_typed_variable_decl(char* name, int type, ASTNode* value, int line, int column);
ASTNode* create_assignment(char* name, ASTNode* value, int line, int column);
ASTNode* create_compound_assignment(char* name, int op, ASTNode* value, int line, int column);
ASTNode* create_increment(char* name, int line, int column);
ASTNode* create_decrement(char* name, int line, int column);
ASTNode* create_binary_op(int op, ASTNode* left, ASTNode* right, int line, int column);
ASTNode* create_unary_op(int op, ASTNode* operand, int line, int column);
ASTNode* create_ternary(ASTNode* condition, ASTNode* then_expr, ASTNode* else_expr, int line, int column);
ASTNode* create_literal(Value value, int line, int column);
ASTNode* create_identifier(char* name, int line, int column);
ASTNode* create_if(ASTNode* condition, ASTNode* then_branch, ASTNode* else_branch, int line, int column);
ASTNode* create_while(ASTNode* condition, ASTNode* body, int line, int column);
ASTNode* create_for(ASTNode* init, ASTNode* cond, ASTNode* inc, ASTNode* body, int line, int column);
ASTNode* create_foreach(char* var_name, ASTNode* collection, ASTNode* body, int line, int column);
ASTNode* create_function_def(char* name, char** params, int param_count, ASTNode* body, int return_type, int line, int column);
ASTNode* create_function_call(char* name, ASTNode** args, int arg_count, int line, int column);
ASTNode* create_return(ASTNode* value, int line, int column);
ASTNode* create_block(ASTNode** statements, int statement_count, int line, int column);
ASTNode* create_print(ASTNode** expressions, int expr_count, int line, int column);
ASTNode* create_read(char* prompt, int line, int column);
ASTNode* create_array(ASTNode** elements, int element_count, int line, int column);
ASTNode* create_array_access(char* name, ASTNode* index, int line, int column);
ASTNode* create_array_assignment(char* name, ASTNode* index, ASTNode* value, int line, int column);
ASTNode* create_type_cast(int target_type, ASTNode* expression, int line, int column);
ASTNode* create_break(int line, int column);
ASTNode* create_continue(int line, int column);
ASTNode* create_range(ASTNode* start, ASTNode* end, ASTNode* step, int line, int column);
ASTNode* create_sizeof(ASTNode* expression, int line, int column);
ASTNode* create_block_from_list(ASTNode* stmt_list, int line, int column);

// AST utility functions
void free_ast(ASTNode* node);
void print_ast(ASTNode* node, int indent);
const char* node_type_to_string(NodeType type);

#endif