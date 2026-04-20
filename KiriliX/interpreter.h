#ifndef INTERPRETER_H
#define INTERPRETER_H

#include "ast.h"
#include "env.h"

void init_stdlib(Env* global_env);

Value eval(ASTNode* node, Env* env);

#endif
