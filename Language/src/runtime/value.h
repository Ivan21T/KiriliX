// src/runtime/value.h
#ifndef VALUE_H
#define VALUE_H

#include <stdbool.h>
#include <stdint.h>

typedef enum {
    VAL_NUMBER,    // число
    VAL_STRING,    // низ
    VAL_BOOL,      // булев
    VAL_CHAR,      // символ  <- НОВО!
    VAL_FUNCTION,  // функция
    VAL_NULL,      // нищо
    VAL_ARRAY,     // масив
    VAL_ERROR      // грешка
} ValueType;

typedef struct Object Object;
typedef struct Function Function;
typedef struct Array Array;

typedef struct {
    ValueType type;
    union {
        double number;        // число (дробно)
        char* string;         // низ (UTF-8)
        bool boolean;         // булев (истина/лъжа)
        char character;       // символ (8-bit) <- НОВО!
        Function* function;   // функция
        Array* array;         // масив
    } as;
} Value;

struct Array {
    Value* values;
    int capacity;
    int count;
};

struct Function {
    char* name;
    char** params;
    int param_count;
    void* ast_node; // AST node for function body
    bool is_native;
    Value (*native_func)(Value* args, int arg_count);
    int return_type; // Token type for return type
};

// Value creation
Value number_val(double value);
Value string_val(const char* value);
Value bool_val(bool value);
Value char_val(char value);      // <- НОВО!
Value null_val();
Value function_val(Function* function);
Value array_val(Array* array);
Value error_val(const char* message);

// Operations
void free_value(Value value);
Value copy_value(Value value);
bool values_equal(Value a, Value b);
char* value_to_string(Value value);
bool is_truthy(Value value);
Value convert_type(Value value, ValueType target_type);

// Array operations
Array* create_array();
void free_array(Array* array);
void array_append(Array* array, Value value);
Value array_get(Array* array, int index);
void array_set(Array* array, int index, Value value);
int array_length(Array* array);

#endif