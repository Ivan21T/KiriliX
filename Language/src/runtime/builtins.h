// src/runtime/builtins.h
#ifndef BUILTINS_H
#define BUILTINS_H

#include "value.h"

// Native function signatures
Value builtin_print(Value* args, int arg_count);
Value builtin_read(Value* args, int arg_count);
Value builtin_length(Value* args, int arg_count);
Value builtin_type(Value* args, int arg_count);
Value builtin_to_number(Value* args, int arg_count);
Value builtin_to_string(Value* args, int arg_count);
Value builtin_sqrt(Value* args, int arg_count);
Value builtin_pow(Value* args, int arg_count);
Value builtin_sin(Value* args, int arg_count);
Value builtin_cos(Value* args, int arg_count);
Value builtin_abs(Value* args, int arg_count);
Value builtin_floor(Value* args, int arg_count);
Value builtin_ceil(Value* args, int arg_count);
Value builtin_round(Value* args, int arg_count);
Value builtin_random(Value* args, int arg_count);
Value builtin_time(Value* args, int arg_count);
Value builtin_split(Value* args, int arg_count);
Value builtin_join(Value* args, int arg_count);
Value builtin_trim(Value* args, int arg_count);
Value builtin_upper(Value* args, int arg_count);
Value builtin_lower(Value* args, int arg_count);

// Built-in registration
void register_builtin_function(Environment* env, const char* name, 
                              Value (*func)(Value*, int), int param_count);

#endif