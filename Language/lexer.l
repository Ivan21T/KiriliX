%{
#include "parser.tab.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
%}

%%



"цяло"[ \t]+ "число"      { return TYPE_INT; }
"дробно"[ \t]+ "число"    { return TYPE_FLOAT; }

"символ"                  { return TYPE_CHAR; }
"текст"                   { return TYPE_STRING; }

"ако"                     { return IF; }
"иначе"                   { return ELSE; }
"за"                      { return FOR; }
"докато"                  { return WHILE; }



[0-9]+"."[0-9]+ {
    yylval.fnum = atof(yytext);
    return FLOAT_NUMBER;
}

[0-9]+ {
    yylval.inum = atoi(yytext);
    return INT_NUMBER;
}


'\''.'\'' {
    yylval.ch = yytext[1];
    return CHAR_LITERAL;
}

\"([^\"\n])*\" {
    yylval.str = strdup(yytext);
    return STRING_LITERAL;
}

/* =====================
   ИДЕНТИФИКАТОРИ
   ===================== */

[a-zA-Z_][a-zA-Z0-9_]* {
    yylval.id = strdup(yytext);
    return IDENTIFIER;
}

/* =====================
   ОПЕРАТОРИ
   ===================== */

"=="   return EQ;
"!="   return NE;
"<="   return LE;
">="   return GE;
"<"    return '<';
">"    return '>';

"="    return '=';
"+"    return '+';
"-"    return '-';
"*"    return '*';
"/"    return '/';

"&&"   return AND;
"||"   return OR;
"!"    return NOT;


"(" return '(';
")" return ')';
"{" return '{';
"}" return '}';
";" return ';';
"," return ',';

[ \t\r\n]+    ;
. {
    printf("Лексикална грешка: непознат символ \"%s\"\n", yytext);
}

%%
