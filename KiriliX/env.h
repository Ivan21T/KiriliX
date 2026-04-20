#ifndef ENV_H
#define ENV_H

#include "ast.h"
#include <stdbool.h>

typedef struct Symbol {
    char* name;
    ValueType declared_type;
    ValueType type;
    Value value;
    bool is_function;
    ASTNode* func_node; 
    bool is_native_function;
    Value (*native_func)(Value* args, int arg_count);
    struct Symbol* next;
} Symbol;

typedef struct Env {
    Symbol* symbols;
    struct Env* parent;
    bool return_flag;
    Value return_value;
} Env;

Env* create_env(Env* parent);
void free_env(Env* env); 

bool env_define_var(Env* env, const char* name, ValueType type);
bool env_set_var(Env* env, const char* name, Value val);
bool env_get_var(Env* env, const char* name, Value* out_val, ValueType* out_type);

bool env_define_func(Env* env, const char* name, ASTNode* func_node);
bool env_define_native_func(Env* env, const char* name, Value (*native_func)(Value* args, int arg_count));
ASTNode* env_get_func(Env* env, const char* name);
Symbol* env_get_func_symbol(Env* env, const char* name);

#endif
