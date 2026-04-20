/* A Bison parser, made by GNU Bison 3.8.2.  */

/* Bison interface for Yacc-like parsers in C

   Copyright (C) 1984, 1989-1990, 2000-2015, 2018-2021 Free Software Foundation,
   Inc.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

/* As a special exception, you may create a larger work that contains
   part or all of the Bison parser skeleton and distribute that work
   under terms of your choice, so long as that work isn't itself a
   parser generator using the skeleton or a modified version thereof
   as a parser skeleton.  Alternatively, if you modify or redistribute
   the parser skeleton itself, you may (at your option) remove this
   special exception, which will cause the skeleton and the resulting
   Bison output files to be licensed under the GNU General Public
   License without this special exception.

   This special exception was added by the Free Software Foundation in
   version 2.2 of Bison.  */

/* DO NOT RELY ON FEATURES THAT ARE NOT DOCUMENTED in the manual,
   especially those whose name start with YY_ or yy_.  They are
   private implementation details that can be changed or removed.  */

#ifndef YY_YY_PARSER_TAB_H_INCLUDED
# define YY_YY_PARSER_TAB_H_INCLUDED
/* Debug traces.  */
#ifndef YYDEBUG
# define YYDEBUG 0
#endif
#if YYDEBUG
extern int yydebug;
#endif
/* "%code requires" blocks.  */
#line 1 "parser.y"

#include "ast.h"
void yyerror(void* root, const char* s);

#line 54 "parser.tab.h"

/* Token kinds.  */
#ifndef YYTOKENTYPE
# define YYTOKENTYPE
  enum yytokentype
  {
    YYEMPTY = -2,
    YYEOF = 0,                     /* "end of file"  */
    YYerror = 256,                 /* error  */
    YYUNDEF = 257,                 /* "invalid token"  */
    TOK_TYPE_INT = 258,            /* TOK_TYPE_INT  */
    TOK_TYPE_FLOAT = 259,          /* TOK_TYPE_FLOAT  */
    TOK_TYPE_STRING = 260,         /* TOK_TYPE_STRING  */
    TOK_TYPE_BOOL = 261,           /* TOK_TYPE_BOOL  */
    TOK_TYPE_CHAR = 262,           /* TOK_TYPE_CHAR  */
    TOK_TYPE_VOID = 263,           /* TOK_TYPE_VOID  */
    TOK_TYPE_DYNAMIC = 264,        /* TOK_TYPE_DYNAMIC  */
    TOK_IF = 265,                  /* TOK_IF  */
    TOK_ELSE = 266,                /* TOK_ELSE  */
    TOK_WHILE = 267,               /* TOK_WHILE  */
    TOK_FOR = 268,                 /* TOK_FOR  */
    TOK_FUNC = 269,                /* TOK_FUNC  */
    TOK_RETURN = 270,              /* TOK_RETURN  */
    TOK_PRINT = 271,               /* TOK_PRINT  */
    TOK_INT_LIT = 272,             /* TOK_INT_LIT  */
    TOK_CHAR_LIT = 273,            /* TOK_CHAR_LIT  */
    TOK_FLOAT_LIT = 274,           /* TOK_FLOAT_LIT  */
    TOK_STR_LIT = 275,             /* TOK_STR_LIT  */
    TOK_IDENTIFIER = 276,          /* TOK_IDENTIFIER  */
    TOK_TRUE = 277,                /* TOK_TRUE  */
    TOK_FALSE = 278,               /* TOK_FALSE  */
    TOK_NULL = 279,                /* TOK_NULL  */
    TOK_PLUS = 280,                /* TOK_PLUS  */
    TOK_MINUS = 281,               /* TOK_MINUS  */
    TOK_MUL = 282,                 /* TOK_MUL  */
    TOK_DIV = 283,                 /* TOK_DIV  */
    TOK_MOD = 284,                 /* TOK_MOD  */
    TOK_ASSIGN = 285,              /* TOK_ASSIGN  */
    TOK_EQ = 286,                  /* TOK_EQ  */
    TOK_NEQ = 287,                 /* TOK_NEQ  */
    TOK_LT = 288,                  /* TOK_LT  */
    TOK_GT = 289,                  /* TOK_GT  */
    TOK_LE = 290,                  /* TOK_LE  */
    TOK_GE = 291,                  /* TOK_GE  */
    TOK_AND = 292,                 /* TOK_AND  */
    TOK_OR = 293,                  /* TOK_OR  */
    TOK_LPAREN = 294,              /* TOK_LPAREN  */
    TOK_RPAREN = 295,              /* TOK_RPAREN  */
    TOK_LBRACE = 296,              /* TOK_LBRACE  */
    TOK_RBRACE = 297,              /* TOK_RBRACE  */
    TOK_LBRACKET = 298,            /* TOK_LBRACKET  */
    TOK_RBRACKET = 299,            /* TOK_RBRACKET  */
    TOK_COMMA = 300,               /* TOK_COMMA  */
    TOK_SEMI = 301                 /* TOK_SEMI  */
  };
  typedef enum yytokentype yytoken_kind_t;
#endif

/* Value type.  */
#if ! defined YYSTYPE && ! defined YYSTYPE_IS_DECLARED
union YYSTYPE
{
#line 23 "parser.y"

    int ival;
    float fval;
    char* sval;
    ASTNode* node;
    ParamList plist;
    ArgList alist;
    ValueType vtype;

#line 127 "parser.tab.h"

};
typedef union YYSTYPE YYSTYPE;
# define YYSTYPE_IS_TRIVIAL 1
# define YYSTYPE_IS_DECLARED 1
#endif


extern YYSTYPE yylval;


int yyparse (void* root);


#endif /* !YY_YY_PARSER_TAB_H_INCLUDED  */
