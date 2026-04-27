%code requires {
#include "ast.h"
void yyerror(void* root, const char* s);
}

%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

extern int yylex();
extern int yylineno;
extern char* yytext;

void yyerror(void* root, const char* s) {
    (void)root;
    fprintf(stderr, "Синтактична грешка (ред %d): %s близо до '%s'\n", yylineno, s, yytext);
}
%}

%parse-param { void* root }

%union {
    int ival;
    float fval;
    char* sval;
    ASTNode* node;
    ParamList plist;
    ArgList alist;
    ValueType vtype;
}

%token TOK_TYPE_INT TOK_TYPE_FLOAT TOK_TYPE_STRING TOK_TYPE_BOOL TOK_TYPE_CHAR TOK_TYPE_VOID TOK_TYPE_DYNAMIC
%token TOK_IF TOK_ELSE TOK_WHILE TOK_FOR
%token TOK_FUNC TOK_RETURN TOK_PRINT
%token <ival> TOK_INT_LIT TOK_CHAR_LIT
%token <fval> TOK_FLOAT_LIT
%token <sval> TOK_STR_LIT TOK_IDENTIFIER
%token TOK_TRUE TOK_FALSE TOK_NULL

%token TOK_PLUS TOK_MINUS TOK_MUL TOK_DIV TOK_MOD
%token TOK_ASSIGN TOK_EQ TOK_NEQ TOK_LT TOK_GT TOK_LE TOK_GE
%token TOK_AND TOK_OR
%token TOK_LPAREN TOK_RPAREN TOK_LBRACE TOK_RBRACE TOK_LBRACKET TOK_RBRACKET TOK_COMMA TOK_SEMI

%type <node> program stmt_list stmt expr block var_decl if_stmt while_stmt for_stmt return_stmt print_stmt func_decl func_call
%type <vtype> type base_type
%type <plist> param_list params
%type <alist> arg_list args

%right TOK_ASSIGN
%left TOK_OR
%left TOK_AND
%left TOK_EQ TOK_NEQ
%left TOK_LT TOK_GT TOK_LE TOK_GE
%left TOK_PLUS TOK_MINUS
%left TOK_MUL TOK_DIV TOK_MOD

%%


program:
    stmt_list { *((ASTNode**)root) = $1; }
    |  { *((ASTNode**)root) = NULL; }
    ;

stmt_list:
    stmt {
        $$ = create_block();
        block_add_stmt($$, $1);
    }
    | stmt_list stmt {
        $$ = $1;
        block_add_stmt($$, $2);
    }
    ;

stmt:
    var_decl TOK_SEMI { $$ = $1; }
    | expr TOK_SEMI { $$ = $1; }
    | func_decl { $$ = $1; }
    | if_stmt { $$ = $1; }
    | while_stmt { $$ = $1; }
    | for_stmt { $$ = $1; }
    | return_stmt TOK_SEMI { $$ = $1; }
    | print_stmt TOK_SEMI { $$ = $1; }
    | block { $$ = $1; }
    ;

block:
    TOK_LBRACE stmt_list TOK_RBRACE { $$ = $2; }
    | TOK_LBRACE TOK_RBRACE { $$ = create_block(); }
    ;

type:
    base_type { $$ = $1; }
    | base_type TOK_LBRACKET TOK_RBRACKET {
        if ($1 == VAL_INT) $$ = VAL_INT_ARRAY;
        else if ($1 == VAL_FLOAT) $$ = VAL_FLOAT_ARRAY;
        else if ($1 == VAL_STRING) $$ = VAL_STRING_ARRAY;
        else if ($1 == VAL_BOOL) $$ = VAL_BOOL_ARRAY;
        else if ($1 == VAL_CHAR) $$ = VAL_CHAR_ARRAY;
        else if ($1 == VAL_DYNAMIC) $$ = VAL_DYNAMIC_ARRAY;
        else $$ = VAL_DYNAMIC_ARRAY;
    }
    ;

base_type:
    TOK_TYPE_INT { $$ = VAL_INT; }
    | TOK_TYPE_FLOAT { $$ = VAL_FLOAT; }
    | TOK_TYPE_STRING { $$ = VAL_STRING; }
    | TOK_TYPE_BOOL { $$ = VAL_BOOL; }
    | TOK_TYPE_CHAR { $$ = VAL_CHAR; }
    | TOK_TYPE_VOID { $$ = VAL_VOID; }
    | TOK_TYPE_DYNAMIC { $$ = VAL_DYNAMIC; }
    ;

var_decl:
    type TOK_IDENTIFIER {
        $$ = create_var_decl($1, $2, NULL);
        free($2);
    }
    | type TOK_IDENTIFIER TOK_ASSIGN expr {
        $$ = create_var_decl($1, $2, $4);
        free($2);
    }
    ;

func_decl:
    TOK_FUNC type TOK_IDENTIFIER TOK_LPAREN params TOK_RPAREN block {
        $$ = create_func_decl($2, $3, $5.count, $5.names, $5.types, $7);
        free($3);
    }
    ;

params:
    param_list { $$ = $1; }
    |  { $$.count = 0; $$.names = NULL; $$.types = NULL; }
    ;

param_list:
    type TOK_IDENTIFIER {
        $$.count = 1;
        $$.names = (char**)malloc(sizeof(char*));
        $$.types = (ValueType*)malloc(sizeof(ValueType));
        $$.names[0] = strdup($2);
        $$.types[0] = $1;
        free($2);
    }
    | param_list TOK_COMMA type TOK_IDENTIFIER {
        $$.count = $1.count + 1;
        $$.names = (char**)realloc($1.names, $$.count * sizeof(char*));
        $$.types = (ValueType*)realloc($1.types, $$.count * sizeof(ValueType));
        $$.names[$$.count - 1] = strdup($4);
        $$.types[$$.count - 1] = $3;
        free($4);
    }
    ;

if_stmt:
    TOK_IF TOK_LPAREN expr TOK_RPAREN block {
        $$ = create_if($3, $5, NULL);
    }
    | TOK_IF TOK_LPAREN expr TOK_RPAREN block TOK_ELSE block {
        $$ = create_if($3, $5, $7);
    }
    | TOK_IF TOK_LPAREN expr TOK_RPAREN block TOK_ELSE if_stmt {
        $$ = create_if($3, $5, $7);
    }
    ;

while_stmt:
    TOK_WHILE TOK_LPAREN expr TOK_RPAREN block {
        $$ = create_while($3, $5);
    }
    ;

for_stmt:
    TOK_FOR TOK_LPAREN var_decl TOK_SEMI expr TOK_SEMI expr TOK_RPAREN block {
        $$ = create_for($3, $5, $7, $9);
    }
    | TOK_FOR TOK_LPAREN expr TOK_SEMI expr TOK_SEMI expr TOK_RPAREN block {
        $$ = create_for($3, $5, $7, $9);
    }
    | TOK_FOR TOK_LPAREN TOK_SEMI expr TOK_SEMI expr TOK_RPAREN block {
        $$ = create_for(NULL, $4, $6, $8);
    }
    | TOK_FOR TOK_LPAREN var_decl TOK_SEMI expr TOK_SEMI TOK_RPAREN block {
        $$ = create_for($3, $5, NULL, $8);
    }
    | TOK_FOR TOK_LPAREN expr TOK_SEMI expr TOK_SEMI TOK_RPAREN block {
        $$ = create_for($3, $5, NULL, $8);
    }
    | TOK_FOR TOK_LPAREN TOK_SEMI expr TOK_SEMI TOK_RPAREN block {
        $$ = create_for(NULL, $4, NULL, $7);
    }
    ;

return_stmt:
    TOK_RETURN expr { $$ = create_return($2); }
    | TOK_RETURN { $$ = create_return(create_null_node()); }
    ;

print_stmt:
    TOK_PRINT TOK_LPAREN expr TOK_RPAREN { $$ = create_print($3); }
    ;

expr:
    TOK_INT_LIT { $$ = create_int_node($1); }
    | TOK_FLOAT_LIT { $$ = create_float_node($1); }
    | TOK_CHAR_LIT { $$ = create_char_node((char)$1); }
    | TOK_STR_LIT { $$ = create_string_node($1); free($1); }
    | TOK_TRUE { $$ = create_bool_node(true); }
    | TOK_FALSE { $$ = create_bool_node(false); }
    | TOK_NULL { $$ = create_null_node(); }
    | TOK_IDENTIFIER { $$ = create_var_access($1); free($1); }
    | TOK_IDENTIFIER TOK_ASSIGN expr { $$ = create_assign($1, $3); free($1); }
    | func_call { $$ = $1; }
    | expr TOK_PLUS expr { $$ = create_binop(OP_PLUS, $1, $3); }
    | expr TOK_MINUS expr { $$ = create_binop(OP_MINUS, $1, $3); }
    | expr TOK_MUL expr { $$ = create_binop(OP_MUL, $1, $3); }
    | expr TOK_DIV expr { $$ = create_binop(OP_DIV, $1, $3); }
    | expr TOK_MOD expr { $$ = create_binop(OP_MOD, $1, $3); }
    | expr TOK_EQ expr { $$ = create_binop(OP_EQ, $1, $3); }
    | expr TOK_NEQ expr { $$ = create_binop(OP_NEQ, $1, $3); }
    | expr TOK_LT expr { $$ = create_binop(OP_LT, $1, $3); }
    | expr TOK_GT expr { $$ = create_binop(OP_GT, $1, $3); }
    | expr TOK_LE expr { $$ = create_binop(OP_LE, $1, $3); }
    | expr TOK_GE expr { $$ = create_binop(OP_GE, $1, $3); }
    | expr TOK_AND expr { $$ = create_binop(OP_AND, $1, $3); }
    | expr TOK_OR expr { $$ = create_binop(OP_OR, $1, $3); }
    | TOK_LPAREN expr TOK_RPAREN { $$ = $2; }
    | TOK_LBRACKET args TOK_RBRACKET { $$ = create_array_literal($2.args, $2.count); }
    | expr TOK_LBRACKET expr TOK_RBRACKET { $$ = create_array_access($1, $3); }
    | expr TOK_LBRACKET expr TOK_RBRACKET TOK_ASSIGN expr { $$ = create_array_assign($1, $3, $6); }
    ;

func_call:
    TOK_IDENTIFIER TOK_LPAREN args TOK_RPAREN {
        $$ = create_func_call($1, $3.count, $3.args);
        free($1);
    }
    ;

args:
    arg_list { $$ = $1; }
    | { $$.count = 0; $$.args = NULL; }
    ;

arg_list:
    expr {
        $$.count = 1;
        $$.args = (ASTNode**)malloc(sizeof(ASTNode*));
        $$.args[0] = $1;
    }
    | arg_list TOK_COMMA expr {
        $$.count = $1.count + 1;
        $$.args = (ASTNode**)realloc($1.args, $$.count * sizeof(ASTNode*));
        $$.args[$$.count - 1] = $3;
    }
    ;

%%

