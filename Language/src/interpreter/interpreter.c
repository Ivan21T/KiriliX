// src/interpreter/interpreter.c
#include "interpreter.h"
#include "../runtime/builtins.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stdarg.h>
#include <math.h>
#include <ctype.h>

#define MAX_CALL_DEPTH 1000
#define MAX_ERROR_MSG 1024

Interpreter* create_interpreter() {
    Interpreter* interpreter = malloc(sizeof(Interpreter));
    interpreter->global_env = create_environment(NULL);
    interpreter->current_env = interpreter->global_env;
    interpreter->debug_mode = false;
    interpreter->call_depth = 0;
    interpreter->max_call_depth = MAX_CALL_DEPTH;
    
    // Initialize control structure
    interpreter->control.has_return = false;
    interpreter->control.should_break = false;
    interpreter->control.should_continue = false;
    interpreter->control.has_error = false;
    interpreter->control.error_message = NULL;
    interpreter->control.return_value = null_val();
    
    return interpreter;
}

void free_interpreter(Interpreter* interpreter) {
    if (!interpreter) return;
    
    if (interpreter->control.error_message) {
        free(interpreter->control.error_message);
    }
    free_value(interpreter->control.return_value);
    
    free_environment(interpreter->global_env);
    free(interpreter);
}

void interpreter_set_debug(Interpreter* interpreter, bool debug) {
    interpreter->debug_mode = debug;
}

void runtime_error(Interpreter* interpreter, const char* format, ...) {
    interpreter->control.has_error = true;
    
    if (interpreter->control.error_message) {
        free(interpreter->control.error_message);
    }
    
    char buffer[MAX_ERROR_MSG];
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, MAX_ERROR_MSG, format, args);
    va_end(args);
    
    interpreter->control.error_message = strdup(buffer);
}

void type_error(Interpreter* interpreter, const char* expected, Value actual) {
    char* actual_str = value_to_string(actual);
    runtime_error(interpreter, "Грешка в типа: очаква се %s, но се получава %s", 
                  expected, actual_str);
    free(actual_str);
}

void assert_number(Interpreter* interpreter, Value value) {
    if (value.type != VAL_NUMBER) {
        type_error(interpreter, "число", value);
    }
}

void assert_string(Interpreter* interpreter, Value value) {
    if (value.type != VAL_STRING) {
        type_error(interpreter, "низ", value);
    }
}

void assert_boolean(Interpreter* interpreter, Value value) {
    if (value.type != VAL_BOOL) {
        type_error(interpreter, "булева стойност", value);
    }
}

void assert_char(Interpreter* interpreter, Value value) {
    if (value.type != VAL_CHAR) {
        type_error(interpreter, "символ", value);
    }
}

void assert_array(Interpreter* interpreter, Value value) {
    if (value.type != VAL_ARRAY) {
        type_error(interpreter, "масив", value);
    }
}

void assert_function(Interpreter* interpreter, Value value) {
    if (value.type != VAL_FUNCTION) {
        type_error(interpreter, "функция", value);
    }
}

Value evaluate_expression(Interpreter* interpreter, ASTNode* node) {
    if (!node || interpreter->control.has_error) {
        return error_val("Невалиден израз");
    }
    
    if (interpreter->debug_mode) {
        printf("[DEBUG] Evaluating node type: %d at line %d\n", node->type, node->line);
    }
    
    switch (node->type) {
        case NODE_LITERAL:
            return copy_value(node->data.value);
            
        case NODE_IDENTIFIER: {
            Value value;
            if (env_get(interpreter->current_env, node->data.name, &value)) {
                return value;
            } else {
                return error_val("Променливата '%s' не е дефинирана", node->data.name);
            }
        }
            
        case NODE_BINARY_OP: {
            Value left = evaluate_expression(interpreter, node->data.binary_op.left);
            if (interpreter->control.has_error) {
                free_value(left);
                return error_val(interpreter->control.error_message);
            }
            
            Value right = evaluate_expression(interpreter, node->data.binary_op.right);
            if (interpreter->control.has_error) {
                free_value(left);
                free_value(right);
                return error_val(interpreter->control.error_message);
            }
            
            Value result = perform_binary_op(interpreter, node->data.binary_op.op, left, right);
            free_value(left);
            free_value(right);
            return result;
        }
            
        case NODE_UNARY_OP: {
            Value operand = evaluate_expression(interpreter, node->data.unary_op.operand);
            if (interpreter->control.has_error) {
                free_value(operand);
                return error_val(interpreter->control.error_message);
            }
            
            Value result = perform_unary_op(interpreter, node->data.unary_op.op, operand);
            free_value(operand);
            return result;
        }
            
        case NODE_TERNARY: {
            Value condition = evaluate_expression(interpreter, node->data.ternary.condition);
            if (interpreter->control.has_error) {
                free_value(condition);
                return error_val(interpreter->control.error_message);
            }
            
            Value result;
            if (is_truthy(condition)) {
                result = evaluate_expression(interpreter, node->data.ternary.then_expr);
            } else {
                result = evaluate_expression(interpreter, node->data.ternary.else_expr);
            }
            free_value(condition);
            return result;
        }
            
        case NODE_FUNCTION_CALL: {
            // Check if it's a built-in function first
            Value func_value;
            if (!env_get(interpreter->current_env, node->data.function_call.name, &func_value)) {
                return error_val("Функцията '%s' не е дефинирана", node->data.function_call.name);
            }
            
            if (func_value.type != VAL_FUNCTION) {
                free_value(func_value);
                return error_val("'%s' не е функция", node->data.function_call.name);
            }
            
            // Evaluate arguments
            Value* args = malloc(sizeof(Value) * node->data.function_call.arg_count);
            for (int i = 0; i < node->data.function_call.arg_count; i++) {
                args[i] = evaluate_expression(interpreter, node->data.function_call.args[i]);
                if (interpreter->control.has_error) {
                    for (int j = 0; j <= i; j++) {
                        free_value(args[j]);
                    }
                    free(args);
                    free_value(func_value);
                    return error_val(interpreter->control.error_message);
                }
            }
            
            // Check call depth
            if (interpreter->call_depth >= interpreter->max_call_depth) {
                for (int i = 0; i < node->data.function_call.arg_count; i++) {
                    free_value(args[i]);
                }
                free(args);
                free_value(func_value);
                return error_val("Превишена максимална дълбочина на извиквания");
            }
            
            interpreter->call_depth++;
            Value result = call_function(interpreter, func_value, args, node->data.function_call.arg_count);
            interpreter->call_depth--;
            
            // Cleanup
            for (int i = 0; i < node->data.function_call.arg_count; i++) {
                free_value(args[i]);
            }
            free(args);
            free_value(func_value);
            
            return result;
        }
            
        case NODE_ARRAY: {
            Array* array = create_array();
            for (int i = 0; i < node->data.array.element_count; i++) {
                Value element = evaluate_expression(interpreter, node->data.array.elements[i]);
                if (interpreter->control.has_error) {
                    free_array(array);
                    free_value(element);
                    return error_val(interpreter->control.error_message);
                }
                array_append(array, element);
            }
            return array_val(array);
        }
            
        case NODE_ARRAY_ACCESS: {
            Value array_value;
            if (!env_get(interpreter->current_env, node->data.array_access.name, &array_value)) {
                return error_val("Масивът '%s' не е дефиниран", node->data.array_access.name);
            }
            
            if (array_value.type != VAL_ARRAY) {
                free_value(array_value);
                return error_val("'%s' не е масив", node->data.array_access.name);
            }
            
            Value index_value = evaluate_expression(interpreter, node->data.array_access.index);
            if (interpreter->control.has_error) {
                free_value(array_value);
                free_value(index_value);
                return error_val(interpreter->control.error_message);
            }
            
            if (index_value.type != VAL_NUMBER) {
                free_value(array_value);
                free_value(index_value);
                return error_val("Индексът трябва да бъде число");
            }
            
            int index = (int)index_value.as.number;
            if (index < 0 || index >= array_value.as.array->count) {
                free_value(array_value);
                free_value(index_value);
                return error_val("Индекс %d е извън границите на масива", index);
            }
            
            Value result = copy_value(array_get(array_value.as.array, index));
            free_value(array_value);
            free_value(index_value);
            return result;
        }
            
        case NODE_TYPE_CAST: {
            Value value = evaluate_expression(interpreter, node->data.type_cast.expression);
            if (interpreter->control.has_error) {
                free_value(value);
                return error_val(interpreter->control.error_message);
            }
            
            ValueType target_type;
            switch (node->data.type_cast.target_type) {
                case TOK_NUMBER_TYPE: target_type = VAL_NUMBER; break;
                case TOK_STRING_TYPE: target_type = VAL_STRING; break;
                case TOK_BOOL_TYPE: target_type = VAL_BOOL; break;
                case TOK_CHAR_TYPE: target_type = VAL_CHAR; break;
                default:
                    free_value(value);
                    return error_val("Невалиден тип за преобразуване");
            }
            
            Value result = convert_type(value, target_type);
            free_value(value);
            return result;
        }
            
        case NODE_RANGE: {
            Value start_val = evaluate_expression(interpreter, node->data.range.start);
            Value end_val = evaluate_expression(interpreter, node->data.range.end);
            
            if (start_val.type != VAL_NUMBER || end_val.type != VAL_NUMBER) {
                free_value(start_val);
                free_value(end_val);
                return error_val("Границите на обхвата трябва да са числа");
            }
            
            double step = 1.0;
            if (node->data.range.step) {
                Value step_val = evaluate_expression(interpreter, node->data.range.step);
                if (step_val.type != VAL_NUMBER) {
                    free_value(start_val);
                    free_value(end_val);
                    free_value(step_val);
                    return error_val("Стъпката трябва да бъде число");
                }
                step = step_val.as.number;
                free_value(step_val);
            }
            
            Array* array = create_array();
            if (step > 0) {
                for (double i = start_val.as.number; i <= end_val.as.number; i += step) {
                    array_append(array, number_val(i));
                }
            } else if (step < 0) {
                for (double i = start_val.as.number; i >= end_val.as.number; i += step) {
                    array_append(array, number_val(i));
                }
            }
            
            free_value(start_val);
            free_value(end_val);
            return array_val(array);
        }
            
        case NODE_SIZEOF: {
            Value value = evaluate_expression(interpreter, node->data.sizeof_expr.expression);
            if (interpreter->control.has_error) {
                free_value(value);
                return error_val(interpreter->control.error_message);
            }
            
            int size = 0;
            switch (value.type) {
                case VAL_STRING:
                    size = strlen(value.as.string);
                    break;
                case VAL_ARRAY:
                    size = value.as.array->count;
                    break;
                default:
                    free_value(value);
                    return error_val("Операторът 'големина' се прилага само за низове и масиви");
            }
            
            free_value(value);
            return number_val(size);
        }
            
        default:
            return error_val("Неразпознат изразен възел: %d", node->type);
    }
}

Value perform_binary_op(Interpreter* interpreter, int op, Value left, Value right) {
    // Automatic type conversions for arithmetic
    if ((op == TOK_PLUS || op == TOK_MINUS || op == TOK_MULTIPLY || op == TOK_DIVIDE || 
         op == TOK_MODULO || op == TOK_POWER) &&
        left.type == VAL_NUMBER && right.type == VAL_NUMBER) {
        
        double a = left.as.number;
        double b = right.as.number;
        
        switch (op) {
            case TOK_PLUS: return number_val(a + b);
            case TOK_MINUS: return number_val(a - b);
            case TOK_MULTIPLY: return number_val(a * b);
            case TOK_DIVIDE:
                if (b == 0) {
                    return error_val("Деление на нула");
                }
                return number_val(a / b);
            case TOK_MODULO:
                if (b == 0) {
                    return error_val("Модул на нула");
                }
                return number_val(fmod(a, b));
            case TOK_POWER: return number_val(pow(a, b));
            default: return error_val("Невалидна аритметична операция");
        }
    }
    
    // String concatenation
    if (op == TOK_PLUS) {
        if (left.type == VAL_STRING || right.type == VAL_STRING) {
            char* left_str = value_to_string(left);
            char* right_str = value_to_string(right);
            char* result = malloc(strlen(left_str) + strlen(right_str) + 1);
            strcpy(result, left_str);
            strcat(result, right_str);
            Value val = string_val(result);
            free(left_str);
            free(right_str);
            free(result);
            return val;
        }
    }
    
    // Comparison operators
    if (op == TOK_EQUAL) return bool_val(values_equal(left, right));
    if (op == TOK_NOT_EQUAL) return bool_val(!values_equal(left, right));
    
    if (op == TOK_LESS || op == TOK_GREATER || op == TOK_LESS_EQUAL || op == TOK_GREATER_EQUAL) {
        if (left.type == VAL_NUMBER && right.type == VAL_NUMBER) {
            double a = left.as.number;
            double b = right.as.number;
            switch (op) {
                case TOK_LESS: return bool_val(a < b);
                case TOK_GREATER: return bool_val(a > b);
                case TOK_LESS_EQUAL: return bool_val(a <= b);
                case TOK_GREATER_EQUAL: return bool_val(a >= b);
            }
        }
        if (left.type == VAL_STRING && right.type == VAL_STRING) {
            int cmp = strcmp(left.as.string, right.as.string);
            switch (op) {
                case TOK_LESS: return bool_val(cmp < 0);
                case TOK_GREATER: return bool_val(cmp > 0);
                case TOK_LESS_EQUAL: return bool_val(cmp <= 0);
                case TOK_GREATER_EQUAL: return bool_val(cmp >= 0);
            }
        }
        if (left.type == VAL_CHAR && right.type == VAL_CHAR) {
            char a = left.as.character;
            char b = right.as.character;
            switch (op) {
                case TOK_LESS: return bool_val(a < b);
                case TOK_GREATER: return bool_val(a > b);
                case TOK_LESS_EQUAL: return bool_val(a <= b);
                case TOK_GREATER_EQUAL: return bool_val(a >= b);
            }
        }
    }
    
    // Logical operators
    if (op == TOK_AND) return bool_val(is_truthy(left) && is_truthy(right));
    if (op == TOK_OR) return bool_val(is_truthy(left) || is_truthy(right));
    
    return error_val("Невалидна бинарна операция за дадените типове");
}

Value perform_unary_op(Interpreter* interpreter, int op, Value operand) {
    switch (op) {
        case TOK_MINUS:
            if (operand.type == VAL_NUMBER) {
                return number_val(-operand.as.number);
            }
            break;
            
        case TOK_NOT:
            return bool_val(!is_truthy(operand));
            
        case TOK_PLUS:
            if (operand.type == VAL_NUMBER) {
                return copy_value(operand);
            }
            break;
    }
    
    return error_val("Невалидна унарна операция за дадения тип");
}

Value call_function(Interpreter* interpreter, Value func, Value* args, int arg_count) {
    if (func.type != VAL_FUNCTION) {
        return error_val("Стойността не е функция");
    }
    
    Function* function = func.as.function;
    
    if (function->is_native) {
        // Call native function
        return function->native_func(args, arg_count);
    } else {
        // Call user-defined function
        if (function->param_count != arg_count) {
            return error_val("Функцията '%s' очаква %d аргумента, но са подадени %d",
                           function->name, function->param_count, arg_count);
        }
        
        // Create new environment for function
        Environment* func_env = create_environment(interpreter->global_env);
        
        // Define parameters
        for (int i = 0; i < arg_count; i++) {
            env_define(func_env, function->params[i], args[i], 0, false, true);
        }
        
        // Save current environment
        Environment* old_env = interpreter->current_env;
        interpreter->current_env = func_env;
        
        // Execute function body
        Value result = null_val();
        if (function->ast_node) {
            result = interpret(interpreter, (ASTNode*)function->ast_node);
        }
        
        // Check for explicit return
        if (!interpreter->control.has_return) {
            result = null_val();
        }
        
        // Restore environment
        interpreter->current_env = old_env;
        interpreter->control.has_return = false;
        
        // Cleanup
        free_environment(func_env);
        
        return result;
    }
}

Value interpret(Interpreter* interpreter, ASTNode* node) {
    if (!node || interpreter->control.has_error) {
        return error_val("Невалиден възел или грешка в интерпретатора");
    }
    
    Value result = null_val();
    
    switch (node->type) {
        case NODE_PROGRAM: {
            ASTNode* current = node->next;
            while (current && !interpreter->control.has_error) {
                free_value(result);
                result = interpret(interpreter, current);
                current = current->next;
            }
            break;
        }
            
        case NODE_VARIABLE_DECL:
        case NODE_VARIABLE_DECL_TYPED: {
            Value value;
            if (node->data.var_decl.value) {
                value = evaluate_expression(interpreter, node->data.var_decl.value);
                if (interpreter->control.has_error) {
                    return error_val(interpreter->control.error_message);
                }
            } else {
                value = null_val();
            }
            
            // Type checking for typed variables
            if (node->type == NODE_VARIABLE_DECL_TYPED) {
                ValueType expected_type;
                switch (node->data.var_decl.var_type) {
                    case TOK_NUMBER_TYPE: expected_type = VAL_NUMBER; break;
                    case TOK_STRING_TYPE: expected_type = VAL_STRING; break;
                    case TOK_BOOL_TYPE: expected_type = VAL_BOOL; break;
                    case TOK_CHAR_TYPE: expected_type = VAL_CHAR; break;
                    default: expected_type = value.type;
                }
                
                if (value.type != expected_type) {
                    Value converted = convert_type(value, expected_type);
                    if (converted.type == VAL_ERROR) {
                        free_value(value);
                        free_value(converted);
                        return error_val("Несъответствие в типа на променливата '%s'", 
                                       node->data.var_decl.name);
                    }
                    free_value(value);
                    value = converted;
                }
            }
            
            if (!env_define(interpreter->current_env, node->data.var_decl.name, 
                           value, node->data.var_decl.var_type, false, true)) {
                free_value(value);
                return error_val("Променливата '%s' вече е дефинирана", 
                               node->data.var_decl.name);
            }
            
            free_value(value);
            result = null_val();
            break;
        }
            
        case NODE_ASSIGNMENT: {
            Value value = evaluate_expression(interpreter, node->data.assignment.value);
            if (interpreter->control.has_error) {
                free_value(value);
                return error_val(interpreter->control.error_message);
            }
            
            if (!env_assign(interpreter->current_env, node->data.assignment.name, value)) {
                free_value(value);
                return error_val("Променливата '%s' не е дефинирана", 
                               node->data.assignment.name);
            }
            
            free_value(value);
            result = null_val();
            break;
        }
            
        case NODE_COMPOUND_ASSIGNMENT: {
            // Get current value
            Value current;
            if (!env_get(interpreter->current_env, node->data.compound_assignment.name, &current)) {
                return error_val("Променливата '%s' не е дефинирана", 
                               node->data.compound_assignment.name);
            }
            
            // Get right value
            Value right = evaluate_expression(interpreter, node->data.compound_assignment.value);
            if (interpreter->control.has_error) {
                free_value(current);
                free_value(right);
                return error_val(interpreter->control.error_message);
            }
            
            // Perform operation
            Value new_value = perform_binary_op(interpreter, node->data.compound_assignment.op, 
                                               current, right);
            if (new_value.type == VAL_ERROR) {
                free_value(current);
                free_value(right);
                free_value(new_value);
                return error_val(interpreter->control.error_message);
            }
            
            // Assign back
            if (!env_assign(interpreter->current_env, node->data.compound_assignment.name, new_value)) {
                free_value(current);
                free_value(right);
                free_value(new_value);
                return error_val("Не може да се присвои на '%s'", 
                               node->data.compound_assignment.name);
            }
            
            free_value(current);
            free_value(right);
            free_value(new_value);
            result = null_val();
            break;
        }
            
        case NODE_INCREMENT:
        case NODE_DECREMENT: {
            Value current;
            if (!env_get(interpreter->current_env, node->data.assignment.name, &current)) {
                return error_val("Променливата '%s' не е дефинирана", 
                               node->data.assignment.name);
            }
            
            if (current.type != VAL_NUMBER) {
                free_value(current);
                return error_val("Операциите ++ и -- се прилагат само за числа");
            }
            
            double new_val = current.as.number;
            if (node->type == NODE_INCREMENT) {
                new_val += 1.0;
            } else {
                new_val -= 1.0;
            }
            
            Value new_value = number_val(new_val);
            if (!env_assign(interpreter->current_env, node->data.assignment.name, new_value)) {
                free_value(current);
                free_value(new_value);
                return error_val("Не може да се присвои на '%s'", 
                               node->data.assignment.name);
            }
            
            free_value(current);
            free_value(new_value);
            result = null_val();
            break;
        }
            
        case NODE_IF: {
            Value condition = evaluate_expression(interpreter, node->data.if_stmt.condition);
            if (interpreter->control.has_error) {
                free_value(condition);
                return error_val(interpreter->control.error_message);
            }
            
            if (is_truthy(condition)) {
                result = interpret(interpreter, node->data.if_stmt.then_branch);
            } else if (node->data.if_stmt.else_branch) {
                result = interpret(interpreter, node->data.if_stmt.else_branch);
            } else {
                result = null_val();
            }
            
            free_value(condition);
            break;
        }
            
        case NODE_WHILE: {
            while (true) {
                if (interpreter->control.should_break || interpreter->control.has_error) {
                    break;
                }
                
                Value condition = evaluate_expression(interpreter, node->data.while_loop.condition);
                if (interpreter->control.has_error) {
                    free_value(condition);
                    break;
                }
                
                if (!is_truthy(condition)) {
                    free_value(condition);
                    break;
                }
                
                free_value(condition);
                
                // Execute body
                interpreter->control.should_continue = false;
                Value body_result = interpret(interpreter, node->data.while_loop.body);
                free_value(body_result);
                
                if (interpreter->control.should_break) {
                    interpreter->control.should_break = false;
                    break;
                }
            }
            
            result = null_val();
            break;
        }
            
        case NODE_FOR: {
            // Execute initializer
            if (node->data.for_loop.initializer) {
                Value init_result = interpret(interpreter, node->data.for_loop.initializer);
                free_value(init_result);
                if (interpreter->control.has_error) {
                    return error_val(interpreter->control.error_message);
                }
            }
            
            while (true) {
                if (interpreter->control.should_break || interpreter->control.has_error) {
                    break;
                }
                
                // Check condition
                if (node->data.for_loop.condition) {
                    Value condition = evaluate_expression(interpreter, node->data.for_loop.condition);
                    if (interpreter->control.has_error) {
                        free_value(condition);
                        break;
                    }
                    
                    if (!is_truthy(condition)) {
                        free_value(condition);
                        break;
                    }
                    free_value(condition);
                }
                
                // Execute body
                interpreter->control.should_continue = false;
                Value body_result = interpret(interpreter, node->data.for_loop.body);
                free_value(body_result);
                
                if (interpreter->control.should_break) {
                    interpreter->control.should_break = false;
                    break;
                }
                
                // Execute increment
                if (node->data.for_loop.increment) {
                    Value inc_result = interpret(interpreter, node->data.for_loop.increment);
                    free_value(inc_result);
                    if (interpreter->control.has_error) {
                        break;
                    }
                }
            }
            
            result = null_val();
            break;
        }
            
        case NODE_FOREACH: {
            Value collection = evaluate_expression(interpreter, node->data.foreach_loop.collection);
            if (interpreter->control.has_error) {
                free_value(collection);
                return error_val(interpreter->control.error_message);
            }
            
            if (collection.type != VAL_ARRAY) {
                free_value(collection);
                return error_val("Цикълът 'за всеки' изисква масив");
            }
            
            Array* array = collection.as.array;
            for (int i = 0; i < array->count; i++) {
                if (interpreter->control.should_break) {
                    break;
                }
                
                // Set loop variable
                Value element = copy_value(array->values[i]);
                env_define(interpreter->current_env, node->data.foreach_loop.var_name, 
                          element, 0, false, true);
                free_value(element);
                
                // Execute body
                interpreter->control.should_continue = false;
                Value body_result = interpret(interpreter, node->data.foreach_loop.body);
                free_value(body_result);
                
                if (interpreter->control.should_break) {
                    interpreter->control.should_break = false;
                    break;
                }
                
                // Remove loop variable for next iteration
                env_remove(interpreter->current_env, node->data.foreach_loop.var_name);
            }
            
            free_value(collection);
            result = null_val();
            break;
        }
            
        case NODE_FUNCTION_DEF: {
            // Create function object
            Function* func = malloc(sizeof(Function));
            func->name = strdup(node->data.function_def.name);
            func->params = node->data.function_def.params;
            func->param_count = node->data.function_def.param_count;
            func->ast_node = node->data.function_def.body;
            func->is_native = false;
            func->native_func = NULL;
            func->return_type = node->data.function_def.return_type;
            
            Value func_value = function_val(func);
            
            // Define function in current environment
            if (!env_define(interpreter->current_env, node->data.function_def.name, 
                           func_value, 0, true, false)) {
                free_value(func_value);
                return error_val("Функцията '%s' вече е дефинирана", 
                               node->data.function_def.name);
            }
            
            free_value(func_value);
            result = null_val();
            break;
        }
            
        case NODE_RETURN: {
            if (node->data.assignment.value) {
                interpreter->control.return_value = evaluate_expression(interpreter, 
                                                                      node->data.assignment.value);
                if (interpreter->control.has_error) {
                    return error_val(interpreter->control.error_message);
                }
            } else {
                interpreter->control.return_value = null_val();
            }
            
            interpreter->control.has_return = true;
            result = copy_value(interpreter->control.return_value);
            break;
        }
            
        case NODE_BLOCK: {
            Environment* block_env = create_environment(interpreter->current_env);
            Environment* old_env = interpreter->current_env;
            interpreter->current_env = block_env;
            
            for (int i = 0; i < node->data.block.statement_count; i++) {
                if (interpreter->control.has_return || 
                    interpreter->control.should_break || 
                    interpreter->control.should_continue ||
                    interpreter->control.has_error) {
                    break;
                }
                
                free_value(result);
                result = interpret(interpreter, node->data.block.statements[i]);
            }
            
            interpreter->current_env = old_env;
            free_environment(block_env);
            break;
        }
            
        case NODE_PRINT: {
            for (int i = 0; i < node->data.print_stmt.expr_count; i++) {
                Value value = evaluate_expression(interpreter, node->data.print_stmt.expressions[i]);
                if (interpreter->control.has_error) {
                    free_value(value);
                    return error_val(interpreter->control.error_message);
                }
                
                char* str = value_to_string(value);
                printf("%s", str);
                free(str);
                free_value(value);
                
                if (i < node->data.print_stmt.expr_count - 1) {
                    printf(" ");
                }
            }
            printf("\n");
            result = null_val();
            break;
        }
            
        case NODE_READ: {
            if (node->data.assignment.name) {
                printf("%s", node->data.assignment.name);
            }
            
            char buffer[1024];
            if (fgets(buffer, sizeof(buffer), stdin)) {
                // Remove newline
                buffer[strcspn(buffer, "\n")] = 0;
                result = string_val(buffer);
            } else {
                result = string_val("");
            }
            break;
        }
            
        case NODE_BREAK:
            interpreter->control.should_break = true;
            result = null_val();
            break;
            
        case NODE_CONTINUE:
            interpreter->control.should_continue = true;
            result = null_val();
            break;
            
        default:
            // For expression statements
            result = evaluate_expression(interpreter, node);
            break;
    }
    
    return result;
}

Value execute_block(Interpreter* interpreter, ASTNode* node, Environment* env) {
    Environment* old_env = interpreter->current_env;
    interpreter->current_env = env;
    
    Value result = interpret(interpreter, node);
    
    interpreter->current_env = old_env;
    return result;
}