%{
#include "ast.h"
#include "parser.h" 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

extern int yylineno;
%}

%option noyywrap
%option yylineno
%option nounput
%option noinput

%%

\xEF\xBB\xBF { }

"цяло"      { return TOK_TYPE_INT; }
"дробно"    { return TOK_TYPE_FLOAT; }
"текст"     { return TOK_TYPE_STRING; }
"булево"    { return TOK_TYPE_BOOL; }
"символ"    { return TOK_TYPE_CHAR; }
"празно"    { return TOK_TYPE_VOID; }
"динамично" { return TOK_TYPE_DYNAMIC; }

"ако"       { return TOK_IF; }
"иначе"     { return TOK_ELSE; }
"докато"    { return TOK_WHILE; }
"за"        { return TOK_FOR; }

"функция"   { return TOK_FUNC; }
"върни"     { return TOK_RETURN; }
"печатай"   { return TOK_PRINT; }

"вярно"     { return TOK_TRUE; }
"грешно"    { return TOK_FALSE; }
"нищо"      { return TOK_NULL; }

[0-9]+                  { yylval.ival = atoi(yytext); return TOK_INT_LIT; }
[0-9]+\.[0-9]+          { yylval.fval = atof(yytext); return TOK_FLOAT_LIT; }
\'([^\'\\]|\\.)\'       { 
                            if (yytext[1] == '\\') {
                                switch(yytext[2]) {
                                    case 'n': yylval.ival = '\n'; break;
                                    case 't': yylval.ival = '\t'; break;
                                    case '\\': yylval.ival = '\\'; break;
                                    case '\'': yylval.ival = '\''; break;
                                    default: yylval.ival = yytext[2]; break;
                                }
                            } else {
                                yylval.ival = yytext[1];
                            }
                            return TOK_CHAR_LIT; 
                        }
\"([^\\\"]|\\.)*\"      { 
                            
                            yylval.sval = strdup(yytext + 1);
                            yylval.sval[strlen(yylval.sval) - 1] = '\0';
                            return TOK_STR_LIT; 
                        }

[a-zA-Z_][a-zA-Z0-9_]*|([a-zA-Z_]?([\xC2-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF4][\x80-\xBF]{3})+[a-zA-Z0-9_]*)+ { 
                            yylval.sval = strdup(yytext); 
                            return TOK_IDENTIFIER; 
                        }

"+"         { return TOK_PLUS; }
"-"         { return TOK_MINUS; }
"*"         { return TOK_MUL; }
"/"         { return TOK_DIV; }
"%"         { return TOK_MOD; }
"="         { return TOK_ASSIGN; }
"=="        { return TOK_EQ; }
"!="        { return TOK_NEQ; }
"<"         { return TOK_LT; }
">"         { return TOK_GT; }
"<="        { return TOK_LE; }
">="        { return TOK_GE; }
"&&"        { return TOK_AND; }
"||"        { return TOK_OR; }

"("         { return TOK_LPAREN; }
")"         { return TOK_RPAREN; }
"{"         { return TOK_LBRACE; }
"}"         { return TOK_RBRACE; }
"["         { return TOK_LBRACKET; }
"]"         { return TOK_RBRACKET; }
","         { return TOK_COMMA; }
";"         { return TOK_SEMI; }

"//".*      {  }
[ \t\r\n]+  {  }
.           { printf("Грешка (ред %d): Неочакван символ '%s'\n", yylineno, yytext); }

%%
