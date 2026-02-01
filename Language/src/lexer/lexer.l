%{
// src/lexer/lexer.l
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "tokens.h"

extern int yylineno;
extern char* yytext;
extern int yycolumn;

int yycolumn = 1;

void update_position();
%}

%option noyywrap
%option yylineno
%option prefix="kx"

DIGIT    [0-9]
LETTER   [a-zA-Z_а-яА-Я]
ID       {LETTER}({LETTER}|{DIGIT})*

%%

"променлива"    { update_position(); return TOK_VAR; }
"ако"           { update_position(); return TOK_IF; }
"иначе"         { update_position(); return TOK_ELSE; }
"иначе ако"     { update_position(); return TOK_ELSEIF; }
"докато"        { update_position(); return TOK_WHILE; }
"за"            { update_position(); return TOK_FOR; }
"функция"       { update_position(); return TOK_FUNCTION; }
"върни"         { update_position(); return TOK_RETURN; }
"тогава"        { update_position(); return TOK_THEN; }
"край"          { update_position(); return TOK_END; }
"и"             { update_position(); return TOK_AND; }
"или"           { update_position(); return TOK_OR; }
"не"            { update_position(); return TOK_NOT; }
"истина"        { update_position(); return TOK_TRUE; }
"лъжа"          { update_position(); return TOK_FALSE; }
"печатай"       { update_position(); return TOK_PRINT; }
"прочети"       { update_position(); return TOK_READ; }
"прекъсни"      { update_position(); return TOK_BREAK; }
"продължи"      { update_position(); return TOK_CONTINUE; }
"число"         { update_position(); return TOK_NUMBER_TYPE; }
"низ"           { update_position(); return TOK_STRING_TYPE; }
"булев"         { update_position(); return TOK_BOOL_TYPE; }
"символ"        { update_position(); return TOK_CHAR_TYPE; }
"нищо"          { update_position(); return TOK_NULL; }

"++"            { update_position(); return TOK_INCREMENT; }
"--"            { update_position(); return TOK_DECREMENT; }
"+"             { update_position(); return TOK_PLUS; }
"-"             { update_position(); return TOK_MINUS; }
"*"             { update_position(); return TOK_MULTIPLY; }
"/"             { update_position(); return TOK_DIVIDE; }
"%"             { update_position(); return TOK_MODULO; }
"^"             { update_position(); return TOK_POWER; }
"="             { update_position(); return TOK_ASSIGN; }
"=="            { update_position(); return TOK_EQUAL; }
"!="            { update_position(); return TOK_NOT_EQUAL; }
"<"             { update_position(); return TOK_LESS; }
">"             { update_position(); return TOK_GREATER; }
"<="            { update_position(); return TOK_LESS_EQUAL; }
">="            { update_position(); return TOK_GREATER_EQUAL; }

"("             { update_position(); return TOK_LPAREN; }
")"             { update_position(); return TOK_RPAREN; }
"{"             { update_position(); return TOK_LBRACE; }
"}"             { update_position(); return TOK_RBRACE; }
"["             { update_position(); return TOK_LBRACKET; }
"]"             { update_position(); return TOK_RBRACKET; }
","             { update_position(); return TOK_COMMA; }
";"             { update_position(); return TOK_SEMICOLON; }
":"             { update_position(); return TOK_COLON; }
"."             { update_position(); return TOK_DOT; }
"?"             { update_position(); return TOK_QUESTION; }
"!"             { update_position(); return TOK_EXCLAMATION; }

{ID}            { 
                    update_position();
                    yylval.string_val = strdup(yytext);
                    return TOK_IDENTIFIER;
                }

{DIGIT}+("."{DIGIT}+)?([eE][+-]?{DIGIT}+)? {
                    update_position();
                    yylval.number_val = atof(yytext);
                    return TOK_NUMBER_LITERAL;
                }

\"([^"\\]|\\.)*\" {
                    update_position();
                    char* str = strdup(yytext);
                    // Remove surrounding quotes and unescape
                    int len = strlen(str);
                    if (len >= 2) {
                        str[len-1] = '\0';
                        yylval.string_val = unescape_string(str + 1);
                    } else {
                        yylval.string_val = strdup("");
                    }
                    free(str);
                    return TOK_STRING_LITERAL;
                }

\'([^'\\]|\\.)\' {
                    update_position();
                    char ch = yytext[1];
                    if (ch == '\\') {
                        switch(yytext[2]) {
                            case 'n': ch = '\n'; break;
                            case 't': ch = '\t'; break;
                            case 'r': ch = '\r'; break;
                            case '0': ch = '\0'; break;
                            case '\\': ch = '\\'; break;
                            case '\'': ch = '\''; break;
                            case '"': ch = '"'; break;
                            default: ch = yytext[2]; break;
                        }
                    }
                    yylval.char_val = ch;
                    return TOK_CHAR_LITERAL;
                }

[ \t]+          { yycolumn += yyleng; }
\n              { yylineno++; yycolumn = 1; }
"//"[^\n]*      { /* Ignore single line comments */ }
"/*"([^*]|"*"[^/])*"*/" { /* Ignore multi-line comments */ }

.               { 
                    update_position(); 
                    fprintf(stderr, "Грешка: Неочакван символ '%c' на ред %d, колона %d\n", 
                            *yytext, yylineno, yycolumn); 
                    return *yytext; 
                }

%%

void update_position() {
    yycolumn += yyleng;
}

char* unescape_string(char* str) {
    char* result = malloc(strlen(str) + 1);
    char* src = str;
    char* dst = result;
    
    while (*src) {
        if (*src == '\\') {
            src++;
            switch (*src) {
                case 'n': *dst++ = '\n'; break;
                case 't': *dst++ = '\t'; break;
                case 'r': *dst++ = '\r'; break;
                case '0': *dst++ = '\0'; break;
                case '\\': *dst++ = '\\'; break;
                case '"': *dst++ = '"'; break;
                case '\'': *dst++ = '\''; break;
                default: *dst++ = *src; break;
            }
            src++;
        } else {
            *dst++ = *src++;
        }
    }
    *dst = '\0';
    return result;
}