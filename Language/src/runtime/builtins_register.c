// src/runtime/builtins_register.c
#include "builtins.h"
#include "../interpreter/environment.h"
#include <stdlib.h>
#include <string.h>

static Function* create_native_function(const char* name, 
                                       Value (*func)(Value*, int),
                                       int param_count) {
    Function* f = malloc(sizeof(Function));
    f->name = strdup(name);
    f->params = NULL;
    f->param_count = param_count;
    f->ast_node = NULL;
    f->is_native = true;
    f->native_func = func;
    f->return_type = 0;
    return f;
}

void register_builtin_function(Environment* env, const char* name, 
                              Value (*func)(Value*, int), int param_count) {
    Function* f = create_native_function(name, func, param_count);
    Value func_val = function_val(f);
    env_define(env, name, func_val, 0, true, false);
    free_value(func_val);
}

void register_builtins(Interpreter* interpreter) {
    Environment* env = interpreter->global_env;
    
    // I/O functions
    register_builtin_function(env, "печатай", builtin_print, -1); // -1 means variable args
    register_builtin_function(env, "прочети", builtin_read, 0);
    
    // Type functions
    register_builtin_function(env, "дължина", builtin_length, 1);
    register_builtin_function(env, "тип", builtin_type, 1);
    register_builtin_function(env, "към_число", builtin_to_number, 1);
    register_builtin_function(env, "към_низ", builtin_to_string, 1);
    
    // Math functions
    register_builtin_function(env, "корен", builtin_sqrt, 1);
    register_builtin_function(env, "степен", builtin_pow, 2);
    register_builtin_function(env, "синус", builtin_sin, 1);
    register_builtin_function(env, "косинус", builtin_cos, 1);
    register_builtin_function(env, "абсолютна", builtin_abs, 1);
    register_builtin_function(env, "закръгли_надолу", builtin_floor, 1);
    register_builtin_function(env, "закръгли_нагоре", builtin_ceil, 1);
    register_builtin_function(env, "закръгли", builtin_round, 1);
    register_builtin_function(env, "случайно", builtin_random, 0); // Can take 0, 1, or 2 args
    register_builtin_function(env, "време", builtin_time, 0);
    
    // String functions
    register_builtin_function(env, "раздели", builtin_split, 2);
    register_builtin_function(env, "съедини", builtin_join, 2);
    register_builtin_function(env, "изрежи", builtin_trim, 1);
    register_builtin_function(env, "главни", builtin_upper, 1);
    register_builtin_function(env, "малки", builtin_lower, 1);
}