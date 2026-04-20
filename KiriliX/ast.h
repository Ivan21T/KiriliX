#ifndef AST_H
#define AST_H

#include <stdbool.h>

typedef enum {
    VAL_INT,
    VAL_FLOAT,
    VAL_STRING,
    VAL_BOOL,
    VAL_CHAR,
    VAL_ARRAY,
    VAL_NULL,
    VAL_VOID,
    VAL_DYNAMIC,
    VAL_INT_ARRAY,
    VAL_FLOAT_ARRAY,
    VAL_STRING_ARRAY,
    VAL_BOOL_ARRAY,
    VAL_CHAR_ARRAY,
    VAL_DYNAMIC_ARRAY
} ValueType;

typedef struct Value {
    ValueType type;
    union {
        int i;
        float f;
        char* str;
        bool b;
        char c;
        struct {
            struct Value* elements;
            int count;
            int capacity;
        } arr;
    } data;
} Value;

typedef enum {
    NODE_INT_LITERAL,
    NODE_FLOAT_LITERAL,
    NODE_STRING_LITERAL,
    NODE_BOOL_LITERAL,
    NODE_CHAR_LITERAL,
    NODE_NULL_LITERAL,
    
    NODE_VAR_ACCESS,
    NODE_VAR_DECLARATION,
    NODE_ASSIGN,
    
    NODE_ARRAY_LITERAL,
    NODE_ARRAY_ACCESS,
    NODE_ARRAY_ASSIGN,
    
    NODE_BINOP,
    NODE_UNOP,
    
    NODE_IF,
    NODE_WHILE,
    NODE_FOR,
    
    NODE_FUNC_DECL,
    NODE_FUNC_CALL,
    NODE_RETURN,
    
    NODE_BLOCK,
    NODE_PRINT
} NodeType;

typedef enum {
    OP_PLUS, OP_MINUS, OP_MUL, OP_DIV, OP_MOD,
    OP_EQ, OP_NEQ, OP_LT, OP_GT, OP_LE, OP_GE,
    OP_AND, OP_OR
} OperatorType;

typedef struct ASTNode {
    NodeType type;
    
    union {
        Value val;      
        struct {
            char* name;
            ValueType var_type; 
            struct ASTNode* initial_value; 
        } var_decl;
        
        struct {
            char* name;
            struct ASTNode* expr;
        } assign;
        
        char* var_name;
        
        struct {
            struct ASTNode** elements;
            int count;
        } array_literal;
        
        struct {
            struct ASTNode* array_expr;
            struct ASTNode* index_expr;
        } array_access;
        
        struct {
            struct ASTNode* array_expr;
            struct ASTNode* index_expr;
            struct ASTNode* value_expr;
        } array_assign;
        
        struct {
            OperatorType op;
            struct ASTNode* left;
            struct ASTNode* right;
        } binop;
        
        struct {
            OperatorType op;
            struct ASTNode* operand;
        } unop;
        
        struct {
            struct ASTNode* condition;
            struct ASTNode* if_body;
            struct ASTNode* else_body;
        } if_stmt;
        
        struct {
            struct ASTNode* condition;
            struct ASTNode* body;
        } while_stmt;
        
        struct {
            struct ASTNode* init;
            struct ASTNode* condition;
            struct ASTNode* update;
            struct ASTNode* body;
        } for_stmt;
        
        struct {
            struct ASTNode** statements;
            int count;
            int capacity;
        } block;
        
        struct {
            char* name;
            ValueType return_type;
            char** param_names;
            ValueType* param_types;
            int param_count;
            struct ASTNode* body;
        } func_decl;
        
        struct {
            char* name;
            struct ASTNode** args;
            int arg_count;
        } func_call;
        
        struct ASTNode* ret_expr;
        
        struct ASTNode* print_expr;
    } as;
} ASTNode;

ASTNode* create_int_node(int val);
ASTNode* create_float_node(float val);
ASTNode* create_string_node(const char* val);
ASTNode* create_bool_node(bool val);
ASTNode* create_char_node(char val);
ASTNode* create_null_node();

ASTNode* create_var_access(const char* name);
ASTNode* create_var_decl(ValueType type, const char* name, ASTNode* init);
ASTNode* create_assign(const char* name, ASTNode* expr);

ASTNode* create_array_literal(ASTNode** elements, int count);
ASTNode* create_array_access(ASTNode* arr, ASTNode* index);
ASTNode* create_array_assign(ASTNode* arr, ASTNode* index, ASTNode* value);

ASTNode* create_binop(OperatorType op, ASTNode* left, ASTNode* right);

ASTNode* create_if(ASTNode* cond, ASTNode* if_body, ASTNode* else_body);
ASTNode* create_while(ASTNode* cond, ASTNode* body);
ASTNode* create_for(ASTNode* init, ASTNode* cond, ASTNode* update, ASTNode* body);
ASTNode* create_block();
void block_add_stmt(ASTNode* block, ASTNode* stmt);

ASTNode* create_func_decl(ValueType ret_type, const char* name, int p_count, char** p_names, ValueType* p_types, ASTNode* body);
ASTNode* create_func_call(const char* name, int arg_count, ASTNode** args);
ASTNode* create_return(ASTNode* expr);
ASTNode* create_print(ASTNode* expr);

void free_ast(ASTNode* node);

typedef struct {
    char** names;
    ValueType* types;
    int count;
} ParamList;

typedef struct {
    ASTNode** args;
    int count;
} ArgList;

#endif
