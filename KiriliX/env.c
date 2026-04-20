#include "env.h"
#include <stdlib.h>
#include <string.h>

Env* create_env(Env* parent) {
    Env* env = (Env*)malloc(sizeof(Env));
    env->symbols = NULL;
    env->parent = parent;
    env->return_flag = false;
    env->return_value.type = VAL_NULL;
    return env;
}

static Symbol* find_symbol(Env* env, const char* name, Env** found_in) {
    Env* current = env;
    while (current) {
        Symbol* sym = current->symbols;
        while (sym) {
            if (strcmp(sym->name, name) == 0) {
                if (found_in) *found_in = current;
                return sym;
            }
            sym = sym->next;
        }
        current = current->parent;
    }
    return NULL;
}

bool env_define_var(Env* env, const char* name, ValueType type) {
    Symbol* sym = env->symbols;
    while (sym) {
        if (strcmp(sym->name, name) == 0) return false; 
        sym = sym->next;
    }
    
    Symbol* new_sym = (Symbol*)malloc(sizeof(Symbol));
    new_sym->name = strdup(name);
    new_sym->declared_type = type;
    new_sym->type = type;
    new_sym->is_function = false;
    new_sym->is_native_function = false;
    new_sym->func_node = NULL;
    new_sym->native_func = NULL;
    
    new_sym->value.type = type;
    if (type == VAL_INT) new_sym->value.data.i = 0;
    else if (type == VAL_FLOAT) new_sym->value.data.f = 0.0f;
    else if (type == VAL_BOOL) new_sym->value.data.b = false;
    else if (type == VAL_CHAR) new_sym->value.data.c = '\0';
    else if (type == VAL_STRING) new_sym->value.data.str = strdup("");
    else if (type == VAL_DYNAMIC) { new_sym->type = VAL_NULL; new_sym->value.type = VAL_NULL; }
    else new_sym->value.type = VAL_NULL;
    
    new_sym->next = env->symbols;
    env->symbols = new_sym;
    return true;
}

bool env_set_var(Env* env, const char* name, Value val) {
    Symbol* sym = find_symbol(env, name, NULL);
    if (!sym || sym->is_function || sym->is_native_function) return false;
    
    if (sym->declared_type != VAL_DYNAMIC && sym->declared_type != val.type && val.type != VAL_NULL) {
        if (val.type == VAL_ARRAY && sym->declared_type >= VAL_INT_ARRAY && sym->declared_type <= VAL_DYNAMIC_ARRAY) {
            ValueType elem_t = VAL_DYNAMIC;
            if (sym->declared_type == VAL_INT_ARRAY) elem_t = VAL_INT;
            else if (sym->declared_type == VAL_FLOAT_ARRAY) elem_t = VAL_FLOAT;
            else if (sym->declared_type == VAL_STRING_ARRAY) elem_t = VAL_STRING;
            else if (sym->declared_type == VAL_BOOL_ARRAY) elem_t = VAL_BOOL;
            else if (sym->declared_type == VAL_CHAR_ARRAY) elem_t = VAL_CHAR;
            
            if (elem_t != VAL_DYNAMIC) {
                for(int i = 0; i < val.data.arr.count; i++) {
                    if (val.data.arr.elements[i].type == VAL_NULL) {
                        val.data.arr.elements[i].type = elem_t;
                        if (elem_t == VAL_INT) val.data.arr.elements[i].data.i = 0;
                        else if (elem_t == VAL_FLOAT) val.data.arr.elements[i].data.f = 0.0f;
                        else if (elem_t == VAL_STRING) val.data.arr.elements[i].data.str = strdup("");
                        else if (elem_t == VAL_BOOL) val.data.arr.elements[i].data.b = false;
                        else if (elem_t == VAL_CHAR) val.data.arr.elements[i].data.c = '\0';
                    } else if (val.data.arr.elements[i].type != elem_t) {
                        return false; 
                    }
                }
            }
            val.type = sym->declared_type;
        } else {
            return false; 
        }
    }
    
    if (sym->type == VAL_STRING && sym->value.data.str) {
        free(sym->value.data.str);
    }
    
    sym->value = val;
    sym->type = val.type;
    if (val.type == VAL_STRING) {
        sym->value.data.str = strdup(val.data.str);
    }
    
    return true;
}

bool env_get_var(Env* env, const char* name, Value* out_val, ValueType* out_type) {
    Symbol* sym = find_symbol(env, name, NULL);
    if (!sym || sym->is_function || sym->is_native_function) return false;
    
    *out_val = sym->value;
    *out_type = sym->type;
    return true;
}

bool env_define_func(Env* env, const char* name, ASTNode* func_node) {
    Env* global_env = env;
    while (global_env->parent != NULL) {
        global_env = global_env->parent;
    }
    
    Symbol* sym = global_env->symbols;
    while (sym) {
        if (strcmp(sym->name, name) == 0) return false; 
        sym = sym->next;
    }
    
    Symbol* new_sym = (Symbol*)malloc(sizeof(Symbol));
    new_sym->name = strdup(name);
    new_sym->declared_type = VAL_VOID;
    new_sym->type = VAL_VOID;
    new_sym->value.type = VAL_VOID;
    new_sym->is_function = true;
    new_sym->is_native_function = false;
    new_sym->func_node = func_node;
    new_sym->native_func = NULL;
    
    new_sym->next = global_env->symbols;
    global_env->symbols = new_sym;
    return true;
}

bool env_define_native_func(Env* env, const char* name, Value (*n_func)(Value* args, int arg_count)) {
    Symbol* sym = env->symbols;
    while (sym) {
        if (strcmp(sym->name, name) == 0) return false;
        sym = sym->next;
    }
    
    Symbol* new_sym = (Symbol*)malloc(sizeof(Symbol));
    new_sym->name = strdup(name);
    new_sym->declared_type = VAL_VOID;
    new_sym->type = VAL_VOID;
    new_sym->value.type = VAL_VOID;
    new_sym->is_function = false;
    new_sym->is_native_function = true;
    new_sym->func_node = NULL;
    new_sym->native_func = n_func;
    
    new_sym->next = env->symbols;
    env->symbols = new_sym;
    return true;
}

ASTNode* env_get_func(Env* env, const char* name) {
    Symbol* sym = find_symbol(env, name, NULL);
    if (sym && sym->is_function) return sym->func_node;
    return NULL;
}

Symbol* env_get_func_symbol(Env* env, const char* name) {
    return find_symbol(env, name, NULL);
}

void free_env(Env* env) {
    Symbol* current = env->symbols;
    while (current) {
        Symbol* next = current->next;
        free(current->name);
        if (current->type == VAL_STRING && !current->is_function && !current->is_native_function && current->value.data.str) {
            free(current->value.data.str);
        }
        free(current);
        current = next;
    }
    free(env);
}
