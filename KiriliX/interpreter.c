#include "interpreter.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>

static Value make_null() {
    Value v; v.type = VAL_NULL; return v;
}

static Value native_length(Value* args, int arg_count) {
    if (arg_count != 1) { fprintf(stderr, "Грешка: дължина() очаква 1 аргумент.\n"); exit(1); }
    Value v = args[0];
    Value res; res.type = VAL_INT;
    if (v.type == VAL_STRING) { res.data.i = strlen(v.data.str); }
    else if (v.type == VAL_ARRAY || (v.type >= VAL_INT_ARRAY && v.type <= VAL_DYNAMIC_ARRAY)) { res.data.i = v.data.arr.count; }
    else { fprintf(stderr, "Грешка: дължина() работи само с текст и масиви.\n"); exit(1); }
    return res;
}

static Value native_sqrt(Value* args, int arg_count) {
    if (arg_count != 1) { fprintf(stderr, "Грешка: корен() очаква 1 аргумент.\n"); exit(1); }
    Value v = args[0];
    Value res; res.type = VAL_FLOAT;
    if (v.type == VAL_INT) res.data.f = sqrt((float)v.data.i);
    else if (v.type == VAL_FLOAT) res.data.f = sqrt(v.data.f);
    else { fprintf(stderr, "Грешка: корен() работи само с числа.\n"); exit(1); }
    return res;
}

static Value native_pow(Value* args, int arg_count) {
    if (arg_count != 2) { fprintf(stderr, "Грешка: степен() очаква 2 аргумента.\n"); exit(1); }
    Value base = args[0]; Value exp = args[1];
    float b = base.type == VAL_INT ? (float)base.data.i : base.data.f;
    float e = exp.type == VAL_INT ? (float)exp.data.i : exp.data.f;
    Value res; res.type = VAL_FLOAT; res.data.f = pow(b, e);
    return res;
}

static Value native_to_int(Value* args, int arg_count) {
    if (arg_count != 1) { fprintf(stderr, "Грешка: към_цяло() очаква 1 аргумент.\n"); exit(1); }
    Value v = args[0];
    Value res; res.type = VAL_INT;
    if (v.type == VAL_FLOAT) res.data.i = (int)v.data.f;
    else if (v.type == VAL_STRING) res.data.i = atoi(v.data.str);
    else if (v.type == VAL_BOOL) res.data.i = v.data.b ? 1 : 0;
    else if (v.type == VAL_INT) res = v;
    else { res.data.i = 0; }
    return res;
}

static Value native_to_string(Value* args, int arg_count) {
    if (arg_count != 1) { fprintf(stderr, "Грешка: към_текст() очаква 1 аргумент.\n"); exit(1); }
    Value v = args[0];
    Value res; res.type = VAL_STRING;
    char buffer[128];
    if (v.type == VAL_INT) { sprintf(buffer, "%d", v.data.i); res.data.str = strdup(buffer); }
    else if (v.type == VAL_FLOAT) { sprintf(buffer, "%f", v.data.f); res.data.str = strdup(buffer); }
    else if (v.type == VAL_BOOL) { res.data.str = strdup(v.data.b ? "вярно" : "грешно"); }
    else if (v.type == VAL_CHAR) { buffer[0] = v.data.c; buffer[1] = '\0'; res.data.str = strdup(buffer); }
    else if (v.type == VAL_STRING) { res.data.str = strdup(v.data.str); }
    else { res.data.str = strdup("непознат"); }
    return res;
}

static Value native_to_float(Value* args, int arg_count) {
    if (arg_count != 1) { fprintf(stderr, "Грешка: към_дробно() очаква 1 аргумент.\n"); exit(1); }
    Value v = args[0];
    Value res; res.type = VAL_FLOAT;
    if (v.type == VAL_INT) res.data.f = (float)v.data.i;
    else if (v.type == VAL_STRING) res.data.f = atof(v.data.str);
    else if (v.type == VAL_BOOL) res.data.f = v.data.b ? 1.0f : 0.0f;
    else if (v.type == VAL_FLOAT) res = v;
    else { res.data.f = 0.0f; }
    return res;
}

static Value native_to_char(Value* args, int arg_count) {
    if (arg_count != 1) { fprintf(stderr, "Грешка: към_символ() очаква 1 аргумент.\n"); exit(1); }
    Value v = args[0];
    Value res; res.type = VAL_CHAR;
    if (v.type == VAL_INT) res.data.c = (char)v.data.i;
    else if (v.type == VAL_FLOAT) res.data.c = (char)v.data.f;
    else if (v.type == VAL_STRING) {
        if (strlen(v.data.str) > 0) res.data.c = v.data.str[0];
        else res.data.c = '\0';
    }
    else if (v.type == VAL_CHAR) res = v;
    else { res.data.c = '\0'; }
    return res;
}

static Value native_input(Value* args, int arg_count) {
    (void)args;
    if (arg_count != 0) { fprintf(stderr, "Грешка: вход() не очаква аргументи.\n"); exit(1); }
    char buffer[1024];
    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
        size_t len = strlen(buffer);
        if (len > 0 && buffer[len - 1] == '\n') buffer[len - 1] = '\0';
        Value res; res.type = VAL_STRING;
        res.data.str = strdup(buffer);
        return res;
    }
    return make_null();
}

static Value native_new_array(Value* args, int arg_count) {
    if (arg_count != 1 || args[0].type != VAL_INT) {
        fprintf(stderr, "Грешка: нов_масив() очаква 1 аргумент от тип цяло.\n"); exit(1); 
    }
    int size = args[0].data.i;
    if (size < 0) { fprintf(stderr, "Грешка: нов_масив() не може да има отрицателен размер.\n"); exit(1); }
    Value res;
    res.type = VAL_ARRAY; 
    res.data.arr.count = size;
    res.data.arr.capacity = size > 0 ? size : 4;
    res.data.arr.elements = (Value*)malloc(res.data.arr.capacity * sizeof(Value));
    for (int i=0; i<size; i++) {
        res.data.arr.elements[i].type = VAL_NULL; 
    }
    return res;
}

static clock_t timer_start_time = 0;

static Value native_start(Value* args, int arg_count) {
    if (arg_count != 0) { fprintf(stderr, "Грешка: начало() не очаква аргументи.\n"); exit(1); }
    timer_start_time = clock();
    return make_null();
}

static Value native_end(Value* args, int arg_count) {
    if (arg_count != 0) { fprintf(stderr, "Грешка: край() не очаква аргументи.\n"); exit(1); }
    Value res; res.type = VAL_FLOAT;
    res.data.f = (float)(clock() - timer_start_time) / CLOCKS_PER_SEC;
    return res;
}

void init_stdlib(Env* global_env) {
    env_define_native_func(global_env, "дължина", native_length);
    env_define_native_func(global_env, "корен", native_sqrt);
    env_define_native_func(global_env, "степен", native_pow);
    env_define_native_func(global_env, "към_цяло", native_to_int);
    env_define_native_func(global_env, "към_дробно", native_to_float);
    env_define_native_func(global_env, "към_символ", native_to_char);
    env_define_native_func(global_env, "към_текст", native_to_string);
    env_define_native_func(global_env, "вход", native_input);
    env_define_native_func(global_env, "нов_масив", native_new_array);
    env_define_native_func(global_env, "начало", native_start);
    env_define_native_func(global_env, "край", native_end);
}



static Value eval_binop(ASTNode* node, Env* env) {
    Value left = eval(node->as.binop.left, env);
    Value res = make_null();
    
    // Short-circuit логика за AND и OR
    if (node->as.binop.op == OP_AND) {
        if (left.type == VAL_BOOL && !left.data.b) {
            res.type = VAL_BOOL; res.data.b = false; return res;
        }
    } else if (node->as.binop.op == OP_OR) {
        if (left.type == VAL_BOOL && left.data.b) {
            res.type = VAL_BOOL; res.data.b = true; return res;
        }
    }
    
    Value right = eval(node->as.binop.right, env);
    
    // Type coercion за числа
    if (left.type == VAL_INT && right.type == VAL_FLOAT) {
        left.type = VAL_FLOAT;
        left.data.f = (float)left.data.i;
    } else if (left.type == VAL_FLOAT && right.type == VAL_INT) {
        right.type = VAL_FLOAT;
        right.data.f = (float)right.data.i;
    }

    if (left.type == VAL_STRING && right.type == VAL_STRING && node->as.binop.op == OP_PLUS) {
        res.type = VAL_STRING;
        res.data.str = (char*)malloc(strlen(left.data.str) + strlen(right.data.str) + 1);
        strcpy(res.data.str, left.data.str);
        strcat(res.data.str, right.data.str);
        return res;
    }
    
    if (left.type == VAL_STRING && right.type == VAL_STRING) {
        if (node->as.binop.op == OP_EQ) { res.type = VAL_BOOL; res.data.b = strcmp(left.data.str, right.data.str) == 0; return res; }
        if (node->as.binop.op == OP_NEQ) { res.type = VAL_BOOL; res.data.b = strcmp(left.data.str, right.data.str) != 0; return res; }
    }
    
    if (left.type == VAL_INT && right.type == VAL_INT) {
        int l = left.data.i;
        int r = right.data.i;
        
        switch (node->as.binop.op) {
            case OP_PLUS: res.type = VAL_INT; res.data.i = l + r; break;
            case OP_MINUS: res.type = VAL_INT; res.data.i = l - r; break;
            case OP_MUL: res.type = VAL_INT; res.data.i = l * r; break;
            case OP_DIV: res.type = VAL_INT; res.data.i = r != 0 ? l / r : 0; break;
            case OP_MOD: res.type = VAL_INT; res.data.i = r != 0 ? l % r : 0; break;
            case OP_EQ: res.type = VAL_BOOL; res.data.b = l == r; break;
            case OP_NEQ: res.type = VAL_BOOL; res.data.b = l != r; break;
            case OP_LT: res.type = VAL_BOOL; res.data.b = l < r; break;
            case OP_GT: res.type = VAL_BOOL; res.data.b = l > r; break;
            case OP_LE: res.type = VAL_BOOL; res.data.b = l <= r; break;
            case OP_GE: res.type = VAL_BOOL; res.data.b = l >= r; break;
            default: break;
        }
    } else if (left.type == VAL_BOOL && right.type == VAL_BOOL) {
        bool l = left.data.b;
        bool r = right.data.b;
        if (node->as.binop.op == OP_AND) { res.type = VAL_BOOL; res.data.b = l && r; }
        else if (node->as.binop.op == OP_OR) { res.type = VAL_BOOL; res.data.b = l || r; }
        else if (node->as.binop.op == OP_EQ) { res.type = VAL_BOOL; res.data.b = l == r; }
        else if (node->as.binop.op == OP_NEQ) { res.type = VAL_BOOL; res.data.b = l != r; }
    } else if (left.type == VAL_FLOAT && right.type == VAL_FLOAT) {
        float l = left.data.f;
        float r = right.data.f;
        switch (node->as.binop.op) {
            case OP_PLUS: res.type = VAL_FLOAT; res.data.f = l + r; break;
            case OP_MINUS: res.type = VAL_FLOAT; res.data.f = l - r; break;
            case OP_MUL: res.type = VAL_FLOAT; res.data.f = l * r; break;
            case OP_DIV: res.type = VAL_FLOAT; res.data.f = r != 0 ? l / r : 0; break;
            case OP_EQ: res.type = VAL_BOOL; res.data.b = l == r; break;
            case OP_NEQ: res.type = VAL_BOOL; res.data.b = l != r; break;
            case OP_LT: res.type = VAL_BOOL; res.data.b = l < r; break;
            case OP_GT: res.type = VAL_BOOL; res.data.b = l > r; break;
            case OP_LE: res.type = VAL_BOOL; res.data.b = l <= r; break;
            case OP_GE: res.type = VAL_BOOL; res.data.b = l >= r; break;
            default: break;
        }
    }
    
    return res;
}

static void print_value(Value val, bool top_level) {
    if (val.type == VAL_INT) printf("%d", val.data.i);
    else if (val.type == VAL_FLOAT) printf("%f", val.data.f);
    else if (val.type == VAL_STRING) {
        if (top_level) printf("%s", val.data.str);
        else printf("\"%s\"", val.data.str);
    }
    else if (val.type == VAL_BOOL) printf("%s", val.data.b ? "вярно" : "грешно");
    else if (val.type == VAL_CHAR) {
        if (top_level) printf("%c", val.data.c);
        else printf("'%c'", val.data.c);
    }
    else if (val.type == VAL_NULL) printf("нищо");
    else if (val.type == VAL_ARRAY || (val.type >= VAL_INT_ARRAY && val.type <= VAL_DYNAMIC_ARRAY)) {
        printf("[");
        for (int i = 0; i < val.data.arr.count; i++) {
            print_value(val.data.arr.elements[i], false);
            if (i < val.data.arr.count - 1) printf(", ");
        }
        printf("]");
    }
}

Value eval(ASTNode* node, Env* env) {
    if (!node) return make_null();
    
    
    switch (node->type) {
        case NODE_INT_LITERAL:
        case NODE_FLOAT_LITERAL:
        case NODE_STRING_LITERAL:
        case NODE_BOOL_LITERAL:
        case NODE_CHAR_LITERAL:
        case NODE_NULL_LITERAL:
            return node->as.val;
            
        case NODE_ARRAY_LITERAL: {
            Value arr_val;
            arr_val.type = VAL_ARRAY;
            int count = node->as.array_literal.count;
            arr_val.data.arr.count = count;
            arr_val.data.arr.capacity = count > 0 ? count : 4;
            arr_val.data.arr.elements = (Value*)malloc(arr_val.data.arr.capacity * sizeof(Value));
            for (int i = 0; i < count; i++) {
                arr_val.data.arr.elements[i] = eval(node->as.array_literal.elements[i], env);
            }
            return arr_val;
        }
            
        case NODE_ARRAY_ACCESS: {
            Value arr_val = eval(node->as.array_access.array_expr, env);
            if (!(arr_val.type == VAL_ARRAY || (arr_val.type >= VAL_INT_ARRAY && arr_val.type <= VAL_DYNAMIC_ARRAY))) {
                fprintf(stderr, "Грешка: Опит за достъп по индекс на не-масив.\n");
                exit(1);
            }
            Value index_val = eval(node->as.array_access.index_expr, env);
            if (index_val.type != VAL_INT) {
                fprintf(stderr, "Грешка: Индексът на масива трябва да е цяло число.\n");
                exit(1);
            }
            int idx = index_val.data.i;
            if (idx < 0 || idx >= arr_val.data.arr.count) {
                fprintf(stderr, "Грешка: Индекс %d извън границите (размер: %d).\n", idx, arr_val.data.arr.count);
                exit(1);
            }
            return arr_val.data.arr.elements[idx];
        }
            
        case NODE_ARRAY_ASSIGN: {
            Value array_val = eval(node->as.array_assign.array_expr, env);
            if (!(array_val.type == VAL_ARRAY || (array_val.type >= VAL_INT_ARRAY && array_val.type <= VAL_DYNAMIC_ARRAY))) {
                fprintf(stderr, "Грешка: Опит за присвояване по индекс на не-масив.\n");
                exit(1);
            }
            Value index_val = eval(node->as.array_assign.index_expr, env);
            if (index_val.type != VAL_INT) {
                fprintf(stderr, "Грешка: Индексът трябва да е цяло число.\n");
                exit(1);
            }
            int idx = index_val.data.i;
            if (idx < 0 || idx >= array_val.data.arr.count) {
                fprintf(stderr, "Грешка: Индекс %d извън границите при присвояване.\n", idx);
                exit(1);
            }
            Value new_val = eval(node->as.array_assign.value_expr, env);
            
            if (array_val.type != VAL_ARRAY && array_val.type != VAL_DYNAMIC_ARRAY) {
                ValueType elem_t = VAL_DYNAMIC;
                if (array_val.type == VAL_INT_ARRAY) elem_t = VAL_INT;
                else if (array_val.type == VAL_FLOAT_ARRAY) elem_t = VAL_FLOAT;
                else if (array_val.type == VAL_STRING_ARRAY) elem_t = VAL_STRING;
                else if (array_val.type == VAL_BOOL_ARRAY) elem_t = VAL_BOOL;
                else if (array_val.type == VAL_CHAR_ARRAY) elem_t = VAL_CHAR;
                
                if (elem_t != VAL_DYNAMIC && new_val.type != elem_t && new_val.type != VAL_NULL) {
                    fprintf(stderr, "Грешка: Типът на елемента не съвпада със строго-типизирания масив!\n");
                    exit(1);
                }
            }
            
            array_val.data.arr.elements[idx] = new_val;
            
            return new_val;
        }
            
        case NODE_VAR_DECLARATION: {
            if (!env_define_var(env, node->as.var_decl.name, node->as.var_decl.var_type)) {
                fprintf(stderr, "Грешка: Променливата '%s' вече е дефинирана.\n", node->as.var_decl.name);
                exit(1);
            }
            if (node->as.var_decl.initial_value) {
                Value init_val = eval(node->as.var_decl.initial_value, env);
                env_set_var(env, node->as.var_decl.name, init_val);
            }
            return make_null();
        }
            
        case NODE_ASSIGN: {
            Value val = eval(node->as.assign.expr, env);
            if (!env_set_var(env, node->as.assign.name, val)) {
                fprintf(stderr, "Грешка: Неуспешно присвояване на '%s'. Променливата може да не съществува или типовете да не съвпадат.\n", node->as.assign.name);
                exit(1);
            }
            return val;
        }
            
        case NODE_VAR_ACCESS: {
            Value val;
            ValueType type;
            if (!env_get_var(env, node->as.var_name, &val, &type)) {
                fprintf(stderr, "Грешка: Променливата '%s' не е дефинирана.\n", node->as.var_name);
                exit(1);
            }
            return val;
        }
            
        case NODE_BINOP:
            return eval_binop(node, env);
            
        case NODE_BLOCK: {
            Env* block_env = create_env(env);
            Value last_val = make_null();
            for (int i = 0; i < node->as.block.count; i++) {
                last_val = eval(node->as.block.statements[i], block_env);
                if (block_env->return_flag) {
                    env->return_flag = true;
                    env->return_value = block_env->return_value;
                    last_val = block_env->return_value;
                    break;
                }
            }
            free_env(block_env);
            return last_val;
        }
            
        case NODE_IF: {
            Value cond = eval(node->as.if_stmt.condition, env);
            if (cond.type == VAL_BOOL && cond.data.b) {
                return eval(node->as.if_stmt.if_body, env);
            } else if (node->as.if_stmt.else_body) {
                return eval(node->as.if_stmt.else_body, env);
            }
            return make_null();
        }
            
        case NODE_WHILE: {
            while (true) {
                Value cond = eval(node->as.while_stmt.condition, env);
                if (cond.type != VAL_BOOL || !cond.data.b) break;
                eval(node->as.while_stmt.body, env);
            }
            return make_null();
        }
            
        case NODE_FOR: {
            Env* for_env = create_env(env);
            
            if (node->as.for_stmt.init) {
                eval(node->as.for_stmt.init, for_env);
            }
            
            while (true) {
                if (node->as.for_stmt.condition) {
                    Value cond = eval(node->as.for_stmt.condition, for_env);
                    if (cond.type != VAL_BOOL || !cond.data.b) break;
                }
                
                eval(node->as.for_stmt.body, for_env);
                
                if (node->as.for_stmt.update) {
                    eval(node->as.for_stmt.update, for_env);
                }
            }
            
            free_env(for_env);
            return make_null();
        }
            
        case NODE_PRINT: {
            Value val = eval(node->as.print_expr, env);
            print_value(val, true);
            printf("\n");
            return make_null();
        }
            
        case NODE_FUNC_DECL: {
            if (!env_define_func(env, node->as.func_decl.name, node)) {
                fprintf(stderr, "Грешка: Функцията '%s' вече е дефинирана.\n", node->as.func_decl.name);
                exit(1);
            }
            return make_null();
        }
            
        case NODE_FUNC_CALL: {
            Symbol* func_sym = env_get_func_symbol(env, node->as.func_call.name);
            if (!func_sym) {
                fprintf(stderr, "Грешка: Функцията '%s' не е намерена.\n", node->as.func_call.name);
                exit(1);
            }
            
            Value* args_vals = (Value*)malloc(node->as.func_call.arg_count * sizeof(Value));
            for (int i = 0; i < node->as.func_call.arg_count; i++) {
                args_vals[i] = eval(node->as.func_call.args[i], env);
            }
            
            if (func_sym->is_native_function) {
                Value ret = func_sym->native_func(args_vals, node->as.func_call.arg_count);
                free(args_vals);
                return ret;
            } else {            
                ASTNode* func = func_sym->func_node;
                if (func->as.func_decl.param_count != node->as.func_call.arg_count) {
                    fprintf(stderr, "Грешка: Невалиден брой аргументи за '%s'.\n", node->as.func_call.name);
                    exit(1);
                }
                
                Env* global_env = env;
                while (global_env->parent != NULL) {
                    global_env = global_env->parent;
                }
                
                Env* func_env = create_env(global_env);
                
                for (int i = 0; i < func->as.func_decl.param_count; i++) {
                    char* p_name = func->as.func_decl.param_names[i];
                    ValueType p_type = func->as.func_decl.param_types[i];
                    env_define_var(func_env, p_name, p_type);
                    env_set_var(func_env, p_name, args_vals[i]);
                }
                free(args_vals);
                
                Value ret = eval(func->as.func_decl.body, func_env);
                
                if (func_env->return_flag) {
                    ret = func_env->return_value;
                }
                
                free_env(func_env);
                return ret;
            }
        }
            
        case NODE_RETURN: {
            Value ret = eval(node->as.ret_expr, env);
            env->return_flag = true;
            env->return_value = ret;
            Env* curr = env;
            while (curr) {
                curr->return_flag = true;
                curr->return_value = ret;
                curr = curr->parent;
            }
            return ret;
        }
            
        default:
            break;
    }
    
    return make_null();
}
