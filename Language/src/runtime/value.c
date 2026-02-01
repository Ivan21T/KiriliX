// src/runtime/value.c
#include "value.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <ctype.h>

Value number_val(double value) {
    Value val;
    val.type = VAL_NUMBER;
    val.as.number = value;
    return val;
}

Value string_val(const char* value) {
    Value val;
    val.type = VAL_STRING;
    val.as.string = strdup(value ? value : "");
    return val;
}

Value bool_val(bool value) {
    Value val;
    val.type = VAL_BOOL;
    val.as.boolean = value;
    return val;
}

Value char_val(char value) {
    Value val;
    val.type = VAL_CHAR;
    val.as.character = value;
    return val;
}

Value null_val() {
    Value val;
    val.type = VAL_NULL;
    return val;
}

Value function_val(Function* function) {
    Value val;
    val.type = VAL_FUNCTION;
    val.as.function = function;
    return val;
}

Value array_val(Array* array) {
    Value val;
    val.type = VAL_ARRAY;
    val.as.array = array;
    return val;
}

Value error_val(const char* message) {
    Value val;
    val.type = VAL_ERROR;
    val.as.string = strdup(message ? message : "Unknown error");
    return val;
}

void free_value(Value value) {
    switch (value.type) {
        case VAL_STRING:
        case VAL_ERROR:
            free(value.as.string);
            break;
        case VAL_FUNCTION:
            if (value.as.function) {
                if (!value.as.function->is_native) {
                    for (int i = 0; i < value.as.function->param_count; i++) {
                        free(value.as.function->params[i]);
                    }
                    free(value.as.function->params);
                }
                free(value.as.function->name);
                free(value.as.function);
            }
            break;
        case VAL_ARRAY:
            free_array(value.as.array);
            break;
        default:
            break;
    }
}

Value copy_value(Value value) {
    switch (value.type) {
        case VAL_STRING:
        case VAL_ERROR:
            return string_val(value.as.string);
        case VAL_FUNCTION:
            return function_val(value.as.function); // Shallow copy
        case VAL_ARRAY: {
            Array* new_array = create_array();
            for (int i = 0; i < value.as.array->count; i++) {
                array_append(new_array, copy_value(value.as.array->values[i]));
            }
            return array_val(new_array);
        }
        default:
            return value;
    }
}

bool values_equal(Value a, Value b) {
    if (a.type != b.type) {
        // Try implicit conversion
        if (a.type == VAL_NUMBER && b.type == VAL_BOOL) {
            return a.as.number == (b.as.boolean ? 1.0 : 0.0);
        }
        if (a.type == VAL_BOOL && b.type == VAL_NUMBER) {
            return (a.as.boolean ? 1.0 : 0.0) == b.as.number;
        }
        if (a.type == VAL_CHAR && b.type == VAL_NUMBER) {
            return (double)a.as.character == b.as.number;
        }
        if (a.type == VAL_NUMBER && b.type == VAL_CHAR) {
            return a.as.number == (double)b.as.character;
        }
        return false;
    }
    
    switch (a.type) {
        case VAL_NUMBER:
            return a.as.number == b.as.number;
        case VAL_STRING:
            return strcmp(a.as.string, b.as.string) == 0;
        case VAL_BOOL:
            return a.as.boolean == b.as.boolean;
        case VAL_CHAR:
            return a.as.character == b.as.character;
        case VAL_NULL:
            return true;
        case VAL_FUNCTION:
            return a.as.function == b.as.function;
        case VAL_ARRAY:
            if (a.as.array->count != b.as.array->count) return false;
            for (int i = 0; i < a.as.array->count; i++) {
                if (!values_equal(a.as.array->values[i], b.as.array->values[i])) {
                    return false;
                }
            }
            return true;
        default:
            return false;
    }
}

char* value_to_string(Value value) {
    char buffer[256];
    
    switch (value.type) {
        case VAL_NUMBER:
            sprintf(buffer, "%g", value.as.number);
            return strdup(buffer);
        case VAL_STRING:
            return strdup(value.as.string);
        case VAL_BOOL:
            return strdup(value.as.boolean ? "истина" : "лъжа");
        case VAL_CHAR:
            if (isprint(value.as.character) && value.as.character != '\'') {
                sprintf(buffer, "'%c'", value.as.character);
            } else {
                switch (value.as.character) {
                    case '\n': sprintf(buffer, "'\\n'"); break;
                    case '\t': sprintf(buffer, "'\\t'"); break;
                    case '\r': sprintf(buffer, "'\\r'"); break;
                    case '\0': sprintf(buffer, "'\\0'"); break;
                    case '\\': sprintf(buffer, "'\\\\'"); break;
                    case '\'': sprintf(buffer, "'\\''"); break;
                    default: sprintf(buffer, "'\\x%02x'", (unsigned char)value.as.character); break;
                }
            }
            return strdup(buffer);
        case VAL_NULL:
            return strdup("нищо");
        case VAL_FUNCTION:
            if (value.as.function->is_native) {
                sprintf(buffer, "<вградена функция %s>", value.as.function->name);
            } else {
                sprintf(buffer, "<функция %s>", value.as.function->name);
            }
            return strdup(buffer);
        case VAL_ARRAY: {
            char* result = malloc(4096);
            strcpy(result, "[");
            for (int i = 0; i < value.as.array->count; i++) {
                char* elem_str = value_to_string(value.as.array->values[i]);
                strcat(result, elem_str);
                free(elem_str);
                if (i < value.as.array->count - 1) {
                    strcat(result, ", ");
                }
            }
            strcat(result, "]");
            return result;
        }
        case VAL_ERROR:
            sprintf(buffer, "<грешка: %s>", value.as.string);
            return strdup(buffer);
        default:
            return strdup("<неизвестна стойност>");
    }
}

bool is_truthy(Value value) {
    switch (value.type) {
        case VAL_NULL:
            return false;
        case VAL_BOOL:
            return value.as.boolean;
        case VAL_NUMBER:
            return value.as.number != 0;
        case VAL_STRING:
            return strlen(value.as.string) > 0;
        case VAL_CHAR:
            return value.as.character != 0;
        case VAL_ARRAY:
            return value.as.array->count > 0;
        default:
            return true;
    }
}

Value convert_type(Value value, ValueType target_type) {
    if (value.type == target_type) return copy_value(value);
    
    switch (target_type) {
        case VAL_NUMBER:
            switch (value.type) {
                case VAL_BOOL:
                    return number_val(value.as.boolean ? 1.0 : 0.0);
                case VAL_CHAR:
                    return number_val((double)value.as.character);
                case VAL_STRING: {
                    char* end;
                    double num = strtod(value.as.string, &end);
                    if (end != value.as.string) {
                        return number_val(num);
                    }
                    break;
                }
                default:
                    break;
            }
            break;
            
        case VAL_STRING:
            return string_val(value_to_string(value));
            
        case VAL_BOOL:
            return bool_val(is_truthy(value));
            
        case VAL_CHAR:
            switch (value.type) {
                case VAL_NUMBER:
                    return char_val((char)value.as.number);
                case VAL_STRING:
                    if (strlen(value.as.string) > 0) {
                        return char_val(value.as.string[0]);
                    }
                    break;
                default:
                    break;
            }
            break;
            
        default:
            break;
    }
    
    return error_val("Не може да се преобразува тип");
}

Array* create_array() {
    Array* array = malloc(sizeof(Array));
    array->capacity = 8;
    array->count = 0;
    array->values = malloc(sizeof(Value) * array->capacity);
    return array;
}

void free_array(Array* array) {
    if (!array) return;
    for (int i = 0; i < array->count; i++) {
        free_value(array->values[i]);
    }
    free(array->values);
    free(array);
}

void array_append(Array* array, Value value) {
    if (array->count >= array->capacity) {
        array->capacity *= 2;
        array->values = realloc(array->values, sizeof(Value) * array->capacity);
    }
    array->values[array->count++] = value;
}

Value array_get(Array* array, int index) {
    if (index < 0 || index >= array->count) {
        return error_val("Индекс извън граници");
    }
    return array->values[index];
}

void array_set(Array* array, int index, Value value) {
    if (index < 0 || index >= array->count) {
        return;
    }
    free_value(array->values[index]);
    array->values[index] = value;
}

int array_length(Array* array) {
    return array->count;
}