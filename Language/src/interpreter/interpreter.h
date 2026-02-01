// src/interpreter/interpreter.h
#ifndef INTERPRETER_H
#define INTERPRETER_H

#include "../parser/ast.h"
#include "environment.h"

typedef struct {
    Value return_value;
    bool has_return;
    bool should_break;
    bool should_continue;
    bool has_error;
    char* error_message;
} RuntimeControl;

typedef struct {
    Environment* global_env;
    Environment* current_env;
    RuntimeControl control;
    bool debug_mode;
    int call_depth;
    int max_call_depth;
} Interpreter;

// Interpreter functions
Interpreter* create_interpreter();
void free_interpreter(Interpreter* interpreter);
void interpreter_set_debug(Interpreter* interpreter, bool debug);
Value interpret(Interpreter* interpreter, ASTNode* node);
Value execute_block(Interpreter* interpreter, ASTNode* node, Environment* env);

// Built-in function registration
void register_builtins(Interpreter* interpreter);

// Error handling
void runtime_error(Interpreter* interpreter, const char* format, ...);
void type_error(Interpreter* interpreter, const char* expected, Value actual);
void assert_number(Interpreter* interpreter, Value value);
void assert_string(Interpreter* interpreter, Value value);
void assert_boolean(Interpreter* interpreter, Value value);
void assert_char(Interpreter* interpreter, Value value);
void assert_array(Interpreter* interpreter, Value value);
void assert_function(Interpreter* interpreter, Value value);

// Helper functions
Value evaluate_expression(Interpreter* interpreter, ASTNode* node);
Value call_function(Interpreter* interpreter, Value func, Value* args, int arg_count);
Value perform_binary_op(Interpreter* interpreter, int op, Value left, Value right);
Value perform_unary_op(Interpreter* interpreter, int op, Value operand);

#endif