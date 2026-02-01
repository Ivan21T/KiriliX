// src/interpreter/environment.c
#include "environment.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

Environment* create_environment(Environment* parent) {
    Environment* env = malloc(sizeof(Environment));
    env->symbols = NULL;
    env->parent = parent;
    env->depth = parent ? parent->depth + 1 : 0;
    return env;
}

void free_environment(Environment* env) {
    Symbol* current = env->symbols;
    while (current) {
        Symbol* next = current->next;
        free(current->name);
        free_value(current->value);
        free(current);
        current = next;
    }
    free(env);
}

bool env_define(Environment* env, const char* name, Value value, int type, bool constant, bool mutable) {
    // Check if already exists in current scope
    Symbol* current = env->symbols;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            return false; // Already defined
        }
        current = current->next;
    }
    
    // Create new symbol
    Symbol* symbol = malloc(sizeof(Symbol));
    symbol->name = strdup(name);
    symbol->value = copy_value(value);
    symbol->type = type;
    symbol->constant = constant;
    symbol->is_mutable = mutable;
    symbol->next = env->symbols;
    env->symbols = symbol;
    
    return true;
}

bool env_assign(Environment* env, const char* name, Value value) {
    // Look in current environment
    Symbol* current = env->symbols;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            if (current->constant) {
                return false; // Cannot assign to constant
            }
            if (!current->is_mutable) {
                return false; // Cannot assign to immutable
            }
            free_value(current->value);
            current->value = copy_value(value);
            return true;
        }
        current = current->next;
    }
    
    // Look in parent environment
    if (env->parent) {
        return env_assign(env->parent, name, value);
    }
    
    return false; // Not found
}

bool env_get(Environment* env, const char* name, Value* result) {
    Symbol* current = env->symbols;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            *result = copy_value(current->value);
            return true;
        }
        current = current->next;
    }
    
    if (env->parent) {
        return env_get(env->parent, name, result);
    }
    
    return false;
}

bool env_get_symbol(Environment* env, const char* name, Symbol** result) {
    Symbol* current = env->symbols;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            *result = current;
            return true;
        }
        current = current->next;
    }
    
    if (env->parent) {
        return env_get_symbol(env->parent, name, result);
    }
    
    *result = NULL;
    return false;
}

bool env_exists(Environment* env, const char* name) {
    Symbol* current = env->symbols;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            return true;
        }
        current = current->next;
    }
    
    if (env->parent) {
        return env_exists(env->parent, name);
    }
    
    return false;
}

bool env_exists_current(Environment* env, const char* name) {
    Symbol* current = env->symbols;
    while (current) {
        if (strcmp(current->name, name) == 0) {
            return true;
        }
        current = current->next;
    }
    return false;
}

void env_remove(Environment* env, const char* name) {
    Symbol** ptr = &env->symbols;
    while (*ptr) {
        Symbol* current = *ptr;
        if (strcmp(current->name, name) == 0) {
            *ptr = current->next;
            free(current->name);
            free_value(current->value);
            free(current);
            return;
        }
        ptr = &(*ptr)->next;
    }
}

void env_print(Environment* env) {
    printf("Environment (depth: %d):\n", env->depth);
    Symbol* current = env->symbols;
    while (current) {
        char* value_str = value_to_string(current->value);
        printf("  %s = %s", current->name, value_str);
        if (current->constant) printf(" (константа)");
        if (!current->is_mutable) printf(" (непроменяем)");
        if (current->type != 0) printf(" [тип: %d]", current->type);
        printf("\n");
        free(value_str);
        current = current->next;
    }
    if (env->parent) {
        printf("Parent environment:\n");
        env_print(env->parent);
    }
}

int env_depth(Environment* env) {
    return env->depth;
}