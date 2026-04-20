/* A Bison parser, made by GNU Bison 3.8.2.  */

/* Bison implementation for Yacc-like parsers in C

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

/* C LALR(1) parser skeleton written by Richard Stallman, by
   simplifying the original so-called "semantic" parser.  */

/* DO NOT RELY ON FEATURES THAT ARE NOT DOCUMENTED in the manual,
   especially those whose name start with YY_ or yy_.  They are
   private implementation details that can be changed or removed.  */

/* All symbols defined below should begin with yy or YY, to avoid
   infringing on user name space.  This should be done even for local
   variables, as they might otherwise be expanded by user macros.
   There are some unavoidable exceptions within include files to
   define necessary library symbols; they are noted "INFRINGES ON
   USER NAME SPACE" below.  */

/* Identify Bison output, and Bison version.  */
#define YYBISON 30802

/* Bison version string.  */
#define YYBISON_VERSION "3.8.2"

/* Skeleton name.  */
#define YYSKELETON_NAME "yacc.c"

/* Pure parsers.  */
#define YYPURE 0

/* Push parsers.  */
#define YYPUSH 0

/* Pull parsers.  */
#define YYPULL 1




/* First part of user prologue.  */
#line 6 "parser.y"

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

#line 86 "parser.tab.c"

# ifndef YY_CAST
#  ifdef __cplusplus
#   define YY_CAST(Type, Val) static_cast<Type> (Val)
#   define YY_REINTERPRET_CAST(Type, Val) reinterpret_cast<Type> (Val)
#  else
#   define YY_CAST(Type, Val) ((Type) (Val))
#   define YY_REINTERPRET_CAST(Type, Val) ((Type) (Val))
#  endif
# endif
# ifndef YY_NULLPTR
#  if defined __cplusplus
#   if 201103L <= __cplusplus
#    define YY_NULLPTR nullptr
#   else
#    define YY_NULLPTR 0
#   endif
#  else
#   define YY_NULLPTR ((void*)0)
#  endif
# endif

#include "parser.tab.h"
/* Symbol kind.  */
enum yysymbol_kind_t
{
  YYSYMBOL_YYEMPTY = -2,
  YYSYMBOL_YYEOF = 0,                      /* "end of file"  */
  YYSYMBOL_YYerror = 1,                    /* error  */
  YYSYMBOL_YYUNDEF = 2,                    /* "invalid token"  */
  YYSYMBOL_TOK_TYPE_INT = 3,               /* TOK_TYPE_INT  */
  YYSYMBOL_TOK_TYPE_FLOAT = 4,             /* TOK_TYPE_FLOAT  */
  YYSYMBOL_TOK_TYPE_STRING = 5,            /* TOK_TYPE_STRING  */
  YYSYMBOL_TOK_TYPE_BOOL = 6,              /* TOK_TYPE_BOOL  */
  YYSYMBOL_TOK_TYPE_CHAR = 7,              /* TOK_TYPE_CHAR  */
  YYSYMBOL_TOK_TYPE_VOID = 8,              /* TOK_TYPE_VOID  */
  YYSYMBOL_TOK_TYPE_DYNAMIC = 9,           /* TOK_TYPE_DYNAMIC  */
  YYSYMBOL_TOK_IF = 10,                    /* TOK_IF  */
  YYSYMBOL_TOK_ELSE = 11,                  /* TOK_ELSE  */
  YYSYMBOL_TOK_WHILE = 12,                 /* TOK_WHILE  */
  YYSYMBOL_TOK_FOR = 13,                   /* TOK_FOR  */
  YYSYMBOL_TOK_FUNC = 14,                  /* TOK_FUNC  */
  YYSYMBOL_TOK_RETURN = 15,                /* TOK_RETURN  */
  YYSYMBOL_TOK_PRINT = 16,                 /* TOK_PRINT  */
  YYSYMBOL_TOK_INT_LIT = 17,               /* TOK_INT_LIT  */
  YYSYMBOL_TOK_CHAR_LIT = 18,              /* TOK_CHAR_LIT  */
  YYSYMBOL_TOK_FLOAT_LIT = 19,             /* TOK_FLOAT_LIT  */
  YYSYMBOL_TOK_STR_LIT = 20,               /* TOK_STR_LIT  */
  YYSYMBOL_TOK_IDENTIFIER = 21,            /* TOK_IDENTIFIER  */
  YYSYMBOL_TOK_TRUE = 22,                  /* TOK_TRUE  */
  YYSYMBOL_TOK_FALSE = 23,                 /* TOK_FALSE  */
  YYSYMBOL_TOK_NULL = 24,                  /* TOK_NULL  */
  YYSYMBOL_TOK_PLUS = 25,                  /* TOK_PLUS  */
  YYSYMBOL_TOK_MINUS = 26,                 /* TOK_MINUS  */
  YYSYMBOL_TOK_MUL = 27,                   /* TOK_MUL  */
  YYSYMBOL_TOK_DIV = 28,                   /* TOK_DIV  */
  YYSYMBOL_TOK_MOD = 29,                   /* TOK_MOD  */
  YYSYMBOL_TOK_ASSIGN = 30,                /* TOK_ASSIGN  */
  YYSYMBOL_TOK_EQ = 31,                    /* TOK_EQ  */
  YYSYMBOL_TOK_NEQ = 32,                   /* TOK_NEQ  */
  YYSYMBOL_TOK_LT = 33,                    /* TOK_LT  */
  YYSYMBOL_TOK_GT = 34,                    /* TOK_GT  */
  YYSYMBOL_TOK_LE = 35,                    /* TOK_LE  */
  YYSYMBOL_TOK_GE = 36,                    /* TOK_GE  */
  YYSYMBOL_TOK_AND = 37,                   /* TOK_AND  */
  YYSYMBOL_TOK_OR = 38,                    /* TOK_OR  */
  YYSYMBOL_TOK_LPAREN = 39,                /* TOK_LPAREN  */
  YYSYMBOL_TOK_RPAREN = 40,                /* TOK_RPAREN  */
  YYSYMBOL_TOK_LBRACE = 41,                /* TOK_LBRACE  */
  YYSYMBOL_TOK_RBRACE = 42,                /* TOK_RBRACE  */
  YYSYMBOL_TOK_LBRACKET = 43,              /* TOK_LBRACKET  */
  YYSYMBOL_TOK_RBRACKET = 44,              /* TOK_RBRACKET  */
  YYSYMBOL_TOK_COMMA = 45,                 /* TOK_COMMA  */
  YYSYMBOL_TOK_SEMI = 46,                  /* TOK_SEMI  */
  YYSYMBOL_YYACCEPT = 47,                  /* $accept  */
  YYSYMBOL_program = 48,                   /* program  */
  YYSYMBOL_stmt_list = 49,                 /* stmt_list  */
  YYSYMBOL_stmt = 50,                      /* stmt  */
  YYSYMBOL_block = 51,                     /* block  */
  YYSYMBOL_type = 52,                      /* type  */
  YYSYMBOL_base_type = 53,                 /* base_type  */
  YYSYMBOL_var_decl = 54,                  /* var_decl  */
  YYSYMBOL_func_decl = 55,                 /* func_decl  */
  YYSYMBOL_params = 56,                    /* params  */
  YYSYMBOL_param_list = 57,                /* param_list  */
  YYSYMBOL_if_stmt = 58,                   /* if_stmt  */
  YYSYMBOL_while_stmt = 59,                /* while_stmt  */
  YYSYMBOL_for_stmt = 60,                  /* for_stmt  */
  YYSYMBOL_return_stmt = 61,               /* return_stmt  */
  YYSYMBOL_print_stmt = 62,                /* print_stmt  */
  YYSYMBOL_expr = 63,                      /* expr  */
  YYSYMBOL_func_call = 64,                 /* func_call  */
  YYSYMBOL_args = 65,                      /* args  */
  YYSYMBOL_arg_list = 66                   /* arg_list  */
};
typedef enum yysymbol_kind_t yysymbol_kind_t;




#ifdef short
# undef short
#endif

/* On compilers that do not define __PTRDIFF_MAX__ etc., make sure
   <limits.h> and (if available) <stdint.h> are included
   so that the code can choose integer types of a good width.  */

#ifndef __PTRDIFF_MAX__
# include <limits.h> /* INFRINGES ON USER NAME SPACE */
# if defined __STDC_VERSION__ && 199901 <= __STDC_VERSION__
#  include <stdint.h> /* INFRINGES ON USER NAME SPACE */
#  define YY_STDINT_H
# endif
#endif

/* Narrow types that promote to a signed type and that can represent a
   signed or unsigned integer of at least N bits.  In tables they can
   save space and decrease cache pressure.  Promoting to a signed type
   helps avoid bugs in integer arithmetic.  */

#ifdef __INT_LEAST8_MAX__
typedef __INT_LEAST8_TYPE__ yytype_int8;
#elif defined YY_STDINT_H
typedef int_least8_t yytype_int8;
#else
typedef signed char yytype_int8;
#endif

#ifdef __INT_LEAST16_MAX__
typedef __INT_LEAST16_TYPE__ yytype_int16;
#elif defined YY_STDINT_H
typedef int_least16_t yytype_int16;
#else
typedef short yytype_int16;
#endif

/* Work around bug in HP-UX 11.23, which defines these macros
   incorrectly for preprocessor constants.  This workaround can likely
   be removed in 2023, as HPE has promised support for HP-UX 11.23
   (aka HP-UX 11i v2) only through the end of 2022; see Table 2 of
   <https://h20195.www2.hpe.com/V2/getpdf.aspx/4AA4-7673ENW.pdf>.  */
#ifdef __hpux
# undef UINT_LEAST8_MAX
# undef UINT_LEAST16_MAX
# define UINT_LEAST8_MAX 255
# define UINT_LEAST16_MAX 65535
#endif

#if defined __UINT_LEAST8_MAX__ && __UINT_LEAST8_MAX__ <= __INT_MAX__
typedef __UINT_LEAST8_TYPE__ yytype_uint8;
#elif (!defined __UINT_LEAST8_MAX__ && defined YY_STDINT_H \
       && UINT_LEAST8_MAX <= INT_MAX)
typedef uint_least8_t yytype_uint8;
#elif !defined __UINT_LEAST8_MAX__ && UCHAR_MAX <= INT_MAX
typedef unsigned char yytype_uint8;
#else
typedef short yytype_uint8;
#endif

#if defined __UINT_LEAST16_MAX__ && __UINT_LEAST16_MAX__ <= __INT_MAX__
typedef __UINT_LEAST16_TYPE__ yytype_uint16;
#elif (!defined __UINT_LEAST16_MAX__ && defined YY_STDINT_H \
       && UINT_LEAST16_MAX <= INT_MAX)
typedef uint_least16_t yytype_uint16;
#elif !defined __UINT_LEAST16_MAX__ && USHRT_MAX <= INT_MAX
typedef unsigned short yytype_uint16;
#else
typedef int yytype_uint16;
#endif

#ifndef YYPTRDIFF_T
# if defined __PTRDIFF_TYPE__ && defined __PTRDIFF_MAX__
#  define YYPTRDIFF_T __PTRDIFF_TYPE__
#  define YYPTRDIFF_MAXIMUM __PTRDIFF_MAX__
# elif defined PTRDIFF_MAX
#  ifndef ptrdiff_t
#   include <stddef.h> /* INFRINGES ON USER NAME SPACE */
#  endif
#  define YYPTRDIFF_T ptrdiff_t
#  define YYPTRDIFF_MAXIMUM PTRDIFF_MAX
# else
#  define YYPTRDIFF_T long
#  define YYPTRDIFF_MAXIMUM LONG_MAX
# endif
#endif

#ifndef YYSIZE_T
# ifdef __SIZE_TYPE__
#  define YYSIZE_T __SIZE_TYPE__
# elif defined size_t
#  define YYSIZE_T size_t
# elif defined __STDC_VERSION__ && 199901 <= __STDC_VERSION__
#  include <stddef.h> /* INFRINGES ON USER NAME SPACE */
#  define YYSIZE_T size_t
# else
#  define YYSIZE_T unsigned
# endif
#endif

#define YYSIZE_MAXIMUM                                  \
  YY_CAST (YYPTRDIFF_T,                                 \
           (YYPTRDIFF_MAXIMUM < YY_CAST (YYSIZE_T, -1)  \
            ? YYPTRDIFF_MAXIMUM                         \
            : YY_CAST (YYSIZE_T, -1)))

#define YYSIZEOF(X) YY_CAST (YYPTRDIFF_T, sizeof (X))


/* Stored state numbers (used for stacks). */
typedef yytype_uint8 yy_state_t;

/* State numbers in computations.  */
typedef int yy_state_fast_t;

#ifndef YY_
# if defined YYENABLE_NLS && YYENABLE_NLS
#  if ENABLE_NLS
#   include <libintl.h> /* INFRINGES ON USER NAME SPACE */
#   define YY_(Msgid) dgettext ("bison-runtime", Msgid)
#  endif
# endif
# ifndef YY_
#  define YY_(Msgid) Msgid
# endif
#endif


#ifndef YY_ATTRIBUTE_PURE
# if defined __GNUC__ && 2 < __GNUC__ + (96 <= __GNUC_MINOR__)
#  define YY_ATTRIBUTE_PURE __attribute__ ((__pure__))
# else
#  define YY_ATTRIBUTE_PURE
# endif
#endif

#ifndef YY_ATTRIBUTE_UNUSED
# if defined __GNUC__ && 2 < __GNUC__ + (7 <= __GNUC_MINOR__)
#  define YY_ATTRIBUTE_UNUSED __attribute__ ((__unused__))
# else
#  define YY_ATTRIBUTE_UNUSED
# endif
#endif

/* Suppress unused-variable warnings by "using" E.  */
#if ! defined lint || defined __GNUC__
# define YY_USE(E) ((void) (E))
#else
# define YY_USE(E) /* empty */
#endif

/* Suppress an incorrect diagnostic about yylval being uninitialized.  */
#if defined __GNUC__ && ! defined __ICC && 406 <= __GNUC__ * 100 + __GNUC_MINOR__
# if __GNUC__ * 100 + __GNUC_MINOR__ < 407
#  define YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN                           \
    _Pragma ("GCC diagnostic push")                                     \
    _Pragma ("GCC diagnostic ignored \"-Wuninitialized\"")
# else
#  define YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN                           \
    _Pragma ("GCC diagnostic push")                                     \
    _Pragma ("GCC diagnostic ignored \"-Wuninitialized\"")              \
    _Pragma ("GCC diagnostic ignored \"-Wmaybe-uninitialized\"")
# endif
# define YY_IGNORE_MAYBE_UNINITIALIZED_END      \
    _Pragma ("GCC diagnostic pop")
#else
# define YY_INITIAL_VALUE(Value) Value
#endif
#ifndef YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN
# define YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN
# define YY_IGNORE_MAYBE_UNINITIALIZED_END
#endif
#ifndef YY_INITIAL_VALUE
# define YY_INITIAL_VALUE(Value) /* Nothing. */
#endif

#if defined __cplusplus && defined __GNUC__ && ! defined __ICC && 6 <= __GNUC__
# define YY_IGNORE_USELESS_CAST_BEGIN                          \
    _Pragma ("GCC diagnostic push")                            \
    _Pragma ("GCC diagnostic ignored \"-Wuseless-cast\"")
# define YY_IGNORE_USELESS_CAST_END            \
    _Pragma ("GCC diagnostic pop")
#endif
#ifndef YY_IGNORE_USELESS_CAST_BEGIN
# define YY_IGNORE_USELESS_CAST_BEGIN
# define YY_IGNORE_USELESS_CAST_END
#endif


#define YY_ASSERT(E) ((void) (0 && (E)))

#if !defined yyoverflow

/* The parser invokes alloca or malloc; define the necessary symbols.  */

# ifdef YYSTACK_USE_ALLOCA
#  if YYSTACK_USE_ALLOCA
#   ifdef __GNUC__
#    define YYSTACK_ALLOC __builtin_alloca
#   elif defined __BUILTIN_VA_ARG_INCR
#    include <alloca.h> /* INFRINGES ON USER NAME SPACE */
#   elif defined _AIX
#    define YYSTACK_ALLOC __alloca
#   elif defined _MSC_VER
#    include <malloc.h> /* INFRINGES ON USER NAME SPACE */
#    define alloca _alloca
#   else
#    define YYSTACK_ALLOC alloca
#    if ! defined _ALLOCA_H && ! defined EXIT_SUCCESS
#     include <stdlib.h> /* INFRINGES ON USER NAME SPACE */
      /* Use EXIT_SUCCESS as a witness for stdlib.h.  */
#     ifndef EXIT_SUCCESS
#      define EXIT_SUCCESS 0
#     endif
#    endif
#   endif
#  endif
# endif

# ifdef YYSTACK_ALLOC
   /* Pacify GCC's 'empty if-body' warning.  */
#  define YYSTACK_FREE(Ptr) do { /* empty */; } while (0)
#  ifndef YYSTACK_ALLOC_MAXIMUM
    /* The OS might guarantee only one guard page at the bottom of the stack,
       and a page size can be as small as 4096 bytes.  So we cannot safely
       invoke alloca (N) if N exceeds 4096.  Use a slightly smaller number
       to allow for a few compiler-allocated temporary stack slots.  */
#   define YYSTACK_ALLOC_MAXIMUM 4032 /* reasonable circa 2006 */
#  endif
# else
#  define YYSTACK_ALLOC YYMALLOC
#  define YYSTACK_FREE YYFREE
#  ifndef YYSTACK_ALLOC_MAXIMUM
#   define YYSTACK_ALLOC_MAXIMUM YYSIZE_MAXIMUM
#  endif
#  if (defined __cplusplus && ! defined EXIT_SUCCESS \
       && ! ((defined YYMALLOC || defined malloc) \
             && (defined YYFREE || defined free)))
#   include <stdlib.h> /* INFRINGES ON USER NAME SPACE */
#   ifndef EXIT_SUCCESS
#    define EXIT_SUCCESS 0
#   endif
#  endif
#  ifndef YYMALLOC
#   define YYMALLOC malloc
#   if ! defined malloc && ! defined EXIT_SUCCESS
void *malloc (YYSIZE_T); /* INFRINGES ON USER NAME SPACE */
#   endif
#  endif
#  ifndef YYFREE
#   define YYFREE free
#   if ! defined free && ! defined EXIT_SUCCESS
void free (void *); /* INFRINGES ON USER NAME SPACE */
#   endif
#  endif
# endif
#endif /* !defined yyoverflow */

#if (! defined yyoverflow \
     && (! defined __cplusplus \
         || (defined YYSTYPE_IS_TRIVIAL && YYSTYPE_IS_TRIVIAL)))

/* A type that is properly aligned for any stack member.  */
union yyalloc
{
  yy_state_t yyss_alloc;
  YYSTYPE yyvs_alloc;
};

/* The size of the maximum gap between one aligned stack and the next.  */
# define YYSTACK_GAP_MAXIMUM (YYSIZEOF (union yyalloc) - 1)

/* The size of an array large to enough to hold all stacks, each with
   N elements.  */
# define YYSTACK_BYTES(N) \
     ((N) * (YYSIZEOF (yy_state_t) + YYSIZEOF (YYSTYPE)) \
      + YYSTACK_GAP_MAXIMUM)

# define YYCOPY_NEEDED 1

/* Relocate STACK from its old location to the new one.  The
   local variables YYSIZE and YYSTACKSIZE give the old and new number of
   elements in the stack, and YYPTR gives the new location of the
   stack.  Advance YYPTR to a properly aligned location for the next
   stack.  */
# define YYSTACK_RELOCATE(Stack_alloc, Stack)                           \
    do                                                                  \
      {                                                                 \
        YYPTRDIFF_T yynewbytes;                                         \
        YYCOPY (&yyptr->Stack_alloc, Stack, yysize);                    \
        Stack = &yyptr->Stack_alloc;                                    \
        yynewbytes = yystacksize * YYSIZEOF (*Stack) + YYSTACK_GAP_MAXIMUM; \
        yyptr += yynewbytes / YYSIZEOF (*yyptr);                        \
      }                                                                 \
    while (0)

#endif

#if defined YYCOPY_NEEDED && YYCOPY_NEEDED
/* Copy COUNT objects from SRC to DST.  The source and destination do
   not overlap.  */
# ifndef YYCOPY
#  if defined __GNUC__ && 1 < __GNUC__
#   define YYCOPY(Dst, Src, Count) \
      __builtin_memcpy (Dst, Src, YY_CAST (YYSIZE_T, (Count)) * sizeof (*(Src)))
#  else
#   define YYCOPY(Dst, Src, Count)              \
      do                                        \
        {                                       \
          YYPTRDIFF_T yyi;                      \
          for (yyi = 0; yyi < (Count); yyi++)   \
            (Dst)[yyi] = (Src)[yyi];            \
        }                                       \
      while (0)
#  endif
# endif
#endif /* !YYCOPY_NEEDED */

/* YYFINAL -- State number of the termination state.  */
#define YYFINAL  54
/* YYLAST -- Last index in YYTABLE.  */
#define YYLAST   642

/* YYNTOKENS -- Number of terminals.  */
#define YYNTOKENS  47
/* YYNNTS -- Number of nonterminals.  */
#define YYNNTS  20
/* YYNRULES -- Number of rules.  */
#define YYNRULES  77
/* YYNSTATES -- Number of states.  */
#define YYNSTATES  152

/* YYMAXUTOK -- Last valid token kind.  */
#define YYMAXUTOK   301


/* YYTRANSLATE(TOKEN-NUM) -- Symbol number corresponding to TOKEN-NUM
   as returned by yylex, with out-of-bounds checking.  */
#define YYTRANSLATE(YYX)                                \
  (0 <= (YYX) && (YYX) <= YYMAXUTOK                     \
   ? YY_CAST (yysymbol_kind_t, yytranslate[YYX])        \
   : YYSYMBOL_YYUNDEF)

/* YYTRANSLATE[TOKEN-NUM] -- Symbol number corresponding to TOKEN-NUM
   as returned by yylex.  */
static const yytype_int8 yytranslate[] =
{
       0,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     2,     2,     2,     2,
       2,     2,     2,     2,     2,     2,     1,     2,     3,     4,
       5,     6,     7,     8,     9,    10,    11,    12,    13,    14,
      15,    16,    17,    18,    19,    20,    21,    22,    23,    24,
      25,    26,    27,    28,    29,    30,    31,    32,    33,    34,
      35,    36,    37,    38,    39,    40,    41,    42,    43,    44,
      45,    46
};

#if YYDEBUG
/* YYRLINE[YYN] -- Source line where rule number YYN was defined.  */
static const yytype_int16 yyrline[] =
{
       0,    64,    64,    65,    69,    73,    80,    81,    82,    83,
      84,    85,    86,    87,    88,    92,    93,    97,    98,   110,
     111,   112,   113,   114,   115,   116,   120,   124,   131,   138,
     139,   143,   151,   162,   165,   168,   174,   180,   183,   186,
     189,   192,   195,   201,   202,   206,   210,   211,   212,   213,
     214,   215,   216,   217,   218,   219,   220,   221,   222,   223,
     224,   225,   226,   227,   228,   229,   230,   231,   232,   233,
     234,   235,   236,   240,   247,   248,   252,   257
};
#endif

/** Accessing symbol of state STATE.  */
#define YY_ACCESSING_SYMBOL(State) YY_CAST (yysymbol_kind_t, yystos[State])

#if YYDEBUG || 0
/* The user-facing name of the symbol whose (internal) number is
   YYSYMBOL.  No bounds checking.  */
static const char *yysymbol_name (yysymbol_kind_t yysymbol) YY_ATTRIBUTE_UNUSED;

/* YYTNAME[SYMBOL-NUM] -- String name of the symbol SYMBOL-NUM.
   First, the terminals, then, starting at YYNTOKENS, nonterminals.  */
static const char *const yytname[] =
{
  "\"end of file\"", "error", "\"invalid token\"", "TOK_TYPE_INT",
  "TOK_TYPE_FLOAT", "TOK_TYPE_STRING", "TOK_TYPE_BOOL", "TOK_TYPE_CHAR",
  "TOK_TYPE_VOID", "TOK_TYPE_DYNAMIC", "TOK_IF", "TOK_ELSE", "TOK_WHILE",
  "TOK_FOR", "TOK_FUNC", "TOK_RETURN", "TOK_PRINT", "TOK_INT_LIT",
  "TOK_CHAR_LIT", "TOK_FLOAT_LIT", "TOK_STR_LIT", "TOK_IDENTIFIER",
  "TOK_TRUE", "TOK_FALSE", "TOK_NULL", "TOK_PLUS", "TOK_MINUS", "TOK_MUL",
  "TOK_DIV", "TOK_MOD", "TOK_ASSIGN", "TOK_EQ", "TOK_NEQ", "TOK_LT",
  "TOK_GT", "TOK_LE", "TOK_GE", "TOK_AND", "TOK_OR", "TOK_LPAREN",
  "TOK_RPAREN", "TOK_LBRACE", "TOK_RBRACE", "TOK_LBRACKET", "TOK_RBRACKET",
  "TOK_COMMA", "TOK_SEMI", "$accept", "program", "stmt_list", "stmt",
  "block", "type", "base_type", "var_decl", "func_decl", "params",
  "param_list", "if_stmt", "while_stmt", "for_stmt", "return_stmt",
  "print_stmt", "expr", "func_call", "args", "arg_list", YY_NULLPTR
};

static const char *
yysymbol_name (yysymbol_kind_t yysymbol)
{
  return yytname[yysymbol];
}
#endif

#define YYPACT_NINF (-53)

#define yypact_value_is_default(Yyn) \
  ((Yyn) == YYPACT_NINF)

#define YYTABLE_NINF (-1)

#define yytable_value_is_error(Yyn) \
  0

/* YYPACT[STATE-NUM] -- Index in YYTABLE of the portion describing
   STATE-NUM.  */
static const yytype_int16 yypact[] =
{
     203,   -53,   -53,   -53,   -53,   -53,   -53,   -53,   -37,   -36,
     -35,   143,   273,   -25,   -53,   -53,   -53,   -53,     3,   -53,
     -53,   -53,   273,   121,   273,    15,   203,   -53,   -53,    -4,
     -24,   -26,   -53,   -53,   -53,   -53,   -16,   -15,   292,   -53,
     273,   273,     4,    16,   555,   273,   273,   273,   422,   -53,
     162,   555,     0,    -7,   -53,   -53,    18,     1,   -53,   -53,
     -53,   273,   273,   273,   273,   273,   273,   273,   273,   273,
     273,   273,   273,   273,   273,   -53,   441,   460,   273,     5,
     314,     7,   479,   555,     9,   -53,   -53,   -53,   273,   273,
     -53,    77,    77,    26,    26,    26,   599,   599,    64,    64,
      64,    64,   587,   574,   402,    11,    11,   336,   273,   273,
     143,   -53,   -53,   555,   555,    40,    60,   -53,   211,   358,
     380,    54,    36,    32,   273,    -9,    11,   498,   238,   246,
     -53,    11,   143,   555,   -53,   -53,   -53,    11,    11,   517,
      11,   536,   -53,    57,   -53,   -53,    11,   -53,    11,   -53,
     -53,   -53
};

/* YYDEFACT[STATE-NUM] -- Default reduction number in state STATE-NUM.
   Performed when YYTABLE does not specify something else to do.  Zero
   means the default is an error.  */
static const yytype_int8 yydefact[] =
{
       3,    19,    20,    21,    22,    23,    24,    25,     0,     0,
       0,     0,    44,     0,    46,    48,    47,    49,    53,    50,
      51,    52,     0,     0,    75,     0,     2,     4,    14,     0,
      17,     0,     8,     9,    10,    11,     0,     0,     0,    55,
       0,     0,     0,     0,    43,     0,     0,    75,     0,    16,
       0,    76,     0,    74,     1,     5,    26,     0,     6,    12,
      13,     0,     0,     0,     0,     0,     0,     0,     0,     0,
       0,     0,     0,     0,     0,     7,     0,     0,     0,     0,
       0,     0,     0,    54,     0,    69,    15,    70,     0,     0,
      18,    56,    57,    58,    59,    60,    61,    62,    63,    64,
      65,    66,    67,    68,     0,     0,     0,     0,     0,     0,
      30,    45,    73,    77,    27,    71,    33,    36,     0,     0,
       0,     0,     0,    29,     0,     0,     0,     0,     0,     0,
      31,     0,     0,    72,    34,    35,    42,     0,     0,     0,
       0,     0,    28,     0,    39,    40,     0,    41,     0,    32,
      37,    38
};

/* YYPGOTO[NTERM-NUM].  */
static const yytype_int8 yypgoto[] =
{
     -53,   -53,    58,   -21,   -52,   -11,   -53,    38,   -53,   -53,
     -53,   -41,   -53,   -53,   -53,   -53,    -6,   -53,    48,   -53
};

/* YYDEFGOTO[NTERM-NUM].  */
static const yytype_int8 yydefgoto[] =
{
       0,    25,    26,    27,    28,    29,    30,    31,    32,   122,
     123,    33,    34,    35,    36,    37,    38,    39,    52,    53
};

/* YYTABLE[YYPACT[STATE-NUM]] -- What to do in state STATE-NUM.  If
   positive, shift that token.  If negative, reduce the rule whose
   number is the opposite.  If YYTABLE_NINF, syntax error.  */
static const yytype_uint8 yytable[] =
{
      43,     8,    40,    41,    42,    55,    44,     1,     2,     3,
       4,     5,     6,     7,    45,    54,    48,    56,    51,    57,
      58,    14,    15,    16,    17,    18,    19,    20,    21,    55,
      59,    60,    23,    46,    76,    77,    80,    81,    88,    82,
      83,    51,    47,    22,    87,    90,   110,    24,    89,   112,
      78,   108,    23,   116,   117,    91,    92,    93,    94,    95,
      96,    97,    98,    99,   100,   101,   102,   103,   104,    74,
     124,   125,   107,   134,   136,   130,   131,   132,   149,   142,
      79,    50,   113,   114,   135,   144,   145,     0,   147,    61,
      62,    63,    64,    65,   150,    84,   151,     0,     0,   121,
       0,     0,   119,   120,    63,    64,    65,    74,     0,     0,
       0,     0,   127,     0,     0,     0,     0,     0,   133,     0,
      74,   143,   139,   141,     1,     2,     3,     4,     5,     6,
       7,     8,     0,     9,    10,    11,    12,    13,    14,    15,
      16,    17,    18,    19,    20,    21,     1,     2,     3,     4,
       5,     6,     7,     0,     0,     0,     0,     0,     0,     0,
      22,     0,    23,    49,    24,     1,     2,     3,     4,     5,
       6,     7,     8,     0,     9,    10,    11,    12,    13,    14,
      15,    16,    17,    18,    19,    20,    21,     0,     0,     0,
       0,     0,     0,     0,     0,     0,     0,     0,     0,     0,
       0,    22,     0,    23,    86,    24,     1,     2,     3,     4,
       5,     6,     7,     8,     0,     9,    10,    11,    12,    13,
      14,    15,    16,    17,    18,    19,    20,    21,    14,    15,
      16,    17,    18,    19,    20,    21,     0,     0,     0,     0,
       0,     0,    22,     0,    23,     0,    24,     0,     0,     0,
      22,   126,     0,     0,    24,    14,    15,    16,    17,    18,
      19,    20,    21,    14,    15,    16,    17,    18,    19,    20,
      21,     0,     0,     0,     0,     0,     0,    22,   138,     0,
       0,    24,     0,     0,     0,    22,   140,     0,     0,    24,
      14,    15,    16,    17,    18,    19,    20,    21,     0,     0,
       0,     0,     0,     0,     0,     0,     0,     0,     0,     0,
       0,     0,    22,     0,     0,     0,    24,    61,    62,    63,
      64,    65,     0,    66,    67,    68,    69,    70,    71,    72,
      73,     0,     0,     0,     0,    74,     0,     0,    75,    61,
      62,    63,    64,    65,     0,    66,    67,    68,    69,    70,
      71,    72,    73,     0,     0,     0,     0,    74,     0,     0,
     109,    61,    62,    63,    64,    65,     0,    66,    67,    68,
      69,    70,    71,    72,    73,     0,     0,     0,     0,    74,
       0,     0,   118,    61,    62,    63,    64,    65,     0,    66,
      67,    68,    69,    70,    71,    72,    73,     0,     0,     0,
       0,    74,     0,     0,   128,    61,    62,    63,    64,    65,
       0,    66,    67,    68,    69,    70,    71,    72,    73,     0,
       0,     0,     0,    74,     0,     0,   129,    61,    62,    63,
      64,    65,     0,    66,    67,    68,    69,    70,    71,    72,
      73,     0,     0,     0,     0,    74,   115,    61,    62,    63,
      64,    65,     0,    66,    67,    68,    69,    70,    71,    72,
      73,     0,    85,     0,     0,    74,    61,    62,    63,    64,
      65,     0,    66,    67,    68,    69,    70,    71,    72,    73,
       0,   105,     0,     0,    74,    61,    62,    63,    64,    65,
       0,    66,    67,    68,    69,    70,    71,    72,    73,     0,
     106,     0,     0,    74,    61,    62,    63,    64,    65,     0,
      66,    67,    68,    69,    70,    71,    72,    73,     0,   111,
       0,     0,    74,    61,    62,    63,    64,    65,     0,    66,
      67,    68,    69,    70,    71,    72,    73,     0,   137,     0,
       0,    74,    61,    62,    63,    64,    65,     0,    66,    67,
      68,    69,    70,    71,    72,    73,     0,   146,     0,     0,
      74,    61,    62,    63,    64,    65,     0,    66,    67,    68,
      69,    70,    71,    72,    73,     0,   148,     0,     0,    74,
      61,    62,    63,    64,    65,     0,    66,    67,    68,    69,
      70,    71,    72,    73,     0,     0,     0,     0,    74,    61,
      62,    63,    64,    65,     0,    66,    67,    68,    69,    70,
      71,    72,    61,    62,    63,    64,    65,    74,    66,    67,
      68,    69,    70,    71,    61,    62,    63,    64,    65,     0,
      74,     0,    68,    69,    70,    71,     0,     0,     0,     0,
       0,     0,    74
};

static const yytype_int16 yycheck[] =
{
      11,    10,    39,    39,    39,    26,    12,     3,     4,     5,
       6,     7,     8,     9,    39,     0,    22,    21,    24,    43,
      46,    17,    18,    19,    20,    21,    22,    23,    24,    50,
      46,    46,    41,    30,    40,    41,    42,    21,    45,    45,
      46,    47,    39,    39,    44,    44,    39,    43,    30,    40,
      46,    46,    41,   105,   106,    61,    62,    63,    64,    65,
      66,    67,    68,    69,    70,    71,    72,    73,    74,    43,
      30,    11,    78,   125,   126,    21,    40,    45,    21,   131,
      42,    23,    88,    89,   125,   137,   138,    -1,   140,    25,
      26,    27,    28,    29,   146,    47,   148,    -1,    -1,   110,
      -1,    -1,   108,   109,    27,    28,    29,    43,    -1,    -1,
      -1,    -1,   118,    -1,    -1,    -1,    -1,    -1,   124,    -1,
      43,   132,   128,   129,     3,     4,     5,     6,     7,     8,
       9,    10,    -1,    12,    13,    14,    15,    16,    17,    18,
      19,    20,    21,    22,    23,    24,     3,     4,     5,     6,
       7,     8,     9,    -1,    -1,    -1,    -1,    -1,    -1,    -1,
      39,    -1,    41,    42,    43,     3,     4,     5,     6,     7,
       8,     9,    10,    -1,    12,    13,    14,    15,    16,    17,
      18,    19,    20,    21,    22,    23,    24,    -1,    -1,    -1,
      -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,
      -1,    39,    -1,    41,    42,    43,     3,     4,     5,     6,
       7,     8,     9,    10,    -1,    12,    13,    14,    15,    16,
      17,    18,    19,    20,    21,    22,    23,    24,    17,    18,
      19,    20,    21,    22,    23,    24,    -1,    -1,    -1,    -1,
      -1,    -1,    39,    -1,    41,    -1,    43,    -1,    -1,    -1,
      39,    40,    -1,    -1,    43,    17,    18,    19,    20,    21,
      22,    23,    24,    17,    18,    19,    20,    21,    22,    23,
      24,    -1,    -1,    -1,    -1,    -1,    -1,    39,    40,    -1,
      -1,    43,    -1,    -1,    -1,    39,    40,    -1,    -1,    43,
      17,    18,    19,    20,    21,    22,    23,    24,    -1,    -1,
      -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,
      -1,    -1,    39,    -1,    -1,    -1,    43,    25,    26,    27,
      28,    29,    -1,    31,    32,    33,    34,    35,    36,    37,
      38,    -1,    -1,    -1,    -1,    43,    -1,    -1,    46,    25,
      26,    27,    28,    29,    -1,    31,    32,    33,    34,    35,
      36,    37,    38,    -1,    -1,    -1,    -1,    43,    -1,    -1,
      46,    25,    26,    27,    28,    29,    -1,    31,    32,    33,
      34,    35,    36,    37,    38,    -1,    -1,    -1,    -1,    43,
      -1,    -1,    46,    25,    26,    27,    28,    29,    -1,    31,
      32,    33,    34,    35,    36,    37,    38,    -1,    -1,    -1,
      -1,    43,    -1,    -1,    46,    25,    26,    27,    28,    29,
      -1,    31,    32,    33,    34,    35,    36,    37,    38,    -1,
      -1,    -1,    -1,    43,    -1,    -1,    46,    25,    26,    27,
      28,    29,    -1,    31,    32,    33,    34,    35,    36,    37,
      38,    -1,    -1,    -1,    -1,    43,    44,    25,    26,    27,
      28,    29,    -1,    31,    32,    33,    34,    35,    36,    37,
      38,    -1,    40,    -1,    -1,    43,    25,    26,    27,    28,
      29,    -1,    31,    32,    33,    34,    35,    36,    37,    38,
      -1,    40,    -1,    -1,    43,    25,    26,    27,    28,    29,
      -1,    31,    32,    33,    34,    35,    36,    37,    38,    -1,
      40,    -1,    -1,    43,    25,    26,    27,    28,    29,    -1,
      31,    32,    33,    34,    35,    36,    37,    38,    -1,    40,
      -1,    -1,    43,    25,    26,    27,    28,    29,    -1,    31,
      32,    33,    34,    35,    36,    37,    38,    -1,    40,    -1,
      -1,    43,    25,    26,    27,    28,    29,    -1,    31,    32,
      33,    34,    35,    36,    37,    38,    -1,    40,    -1,    -1,
      43,    25,    26,    27,    28,    29,    -1,    31,    32,    33,
      34,    35,    36,    37,    38,    -1,    40,    -1,    -1,    43,
      25,    26,    27,    28,    29,    -1,    31,    32,    33,    34,
      35,    36,    37,    38,    -1,    -1,    -1,    -1,    43,    25,
      26,    27,    28,    29,    -1,    31,    32,    33,    34,    35,
      36,    37,    25,    26,    27,    28,    29,    43,    31,    32,
      33,    34,    35,    36,    25,    26,    27,    28,    29,    -1,
      43,    -1,    33,    34,    35,    36,    -1,    -1,    -1,    -1,
      -1,    -1,    43
};

/* YYSTOS[STATE-NUM] -- The symbol kind of the accessing symbol of
   state STATE-NUM.  */
static const yytype_int8 yystos[] =
{
       0,     3,     4,     5,     6,     7,     8,     9,    10,    12,
      13,    14,    15,    16,    17,    18,    19,    20,    21,    22,
      23,    24,    39,    41,    43,    48,    49,    50,    51,    52,
      53,    54,    55,    58,    59,    60,    61,    62,    63,    64,
      39,    39,    39,    52,    63,    39,    30,    39,    63,    42,
      49,    63,    65,    66,     0,    50,    21,    43,    46,    46,
      46,    25,    26,    27,    28,    29,    31,    32,    33,    34,
      35,    36,    37,    38,    43,    46,    63,    63,    46,    54,
      63,    21,    63,    63,    65,    40,    42,    44,    45,    30,
      44,    63,    63,    63,    63,    63,    63,    63,    63,    63,
      63,    63,    63,    63,    63,    40,    40,    63,    46,    46,
      39,    40,    40,    63,    63,    44,    51,    51,    46,    63,
      63,    52,    56,    57,    30,    11,    40,    63,    46,    46,
      21,    40,    45,    63,    51,    58,    51,    40,    40,    63,
      40,    63,    51,    52,    51,    51,    40,    51,    40,    21,
      51,    51
};

/* YYR1[RULE-NUM] -- Symbol kind of the left-hand side of rule RULE-NUM.  */
static const yytype_int8 yyr1[] =
{
       0,    47,    48,    48,    49,    49,    50,    50,    50,    50,
      50,    50,    50,    50,    50,    51,    51,    52,    52,    53,
      53,    53,    53,    53,    53,    53,    54,    54,    55,    56,
      56,    57,    57,    58,    58,    58,    59,    60,    60,    60,
      60,    60,    60,    61,    61,    62,    63,    63,    63,    63,
      63,    63,    63,    63,    63,    63,    63,    63,    63,    63,
      63,    63,    63,    63,    63,    63,    63,    63,    63,    63,
      63,    63,    63,    64,    65,    65,    66,    66
};

/* YYR2[RULE-NUM] -- Number of symbols on the right-hand side of rule RULE-NUM.  */
static const yytype_int8 yyr2[] =
{
       0,     2,     1,     0,     1,     2,     2,     2,     1,     1,
       1,     1,     2,     2,     1,     3,     2,     1,     3,     1,
       1,     1,     1,     1,     1,     1,     2,     4,     7,     1,
       0,     2,     4,     5,     7,     7,     5,     9,     9,     8,
       8,     8,     7,     2,     1,     4,     1,     1,     1,     1,
       1,     1,     1,     1,     3,     1,     3,     3,     3,     3,
       3,     3,     3,     3,     3,     3,     3,     3,     3,     3,
       3,     4,     6,     4,     1,     0,     1,     3
};


enum { YYENOMEM = -2 };

#define yyerrok         (yyerrstatus = 0)
#define yyclearin       (yychar = YYEMPTY)

#define YYACCEPT        goto yyacceptlab
#define YYABORT         goto yyabortlab
#define YYERROR         goto yyerrorlab
#define YYNOMEM         goto yyexhaustedlab


#define YYRECOVERING()  (!!yyerrstatus)

#define YYBACKUP(Token, Value)                                    \
  do                                                              \
    if (yychar == YYEMPTY)                                        \
      {                                                           \
        yychar = (Token);                                         \
        yylval = (Value);                                         \
        YYPOPSTACK (yylen);                                       \
        yystate = *yyssp;                                         \
        goto yybackup;                                            \
      }                                                           \
    else                                                          \
      {                                                           \
        yyerror (root, YY_("syntax error: cannot back up")); \
        YYERROR;                                                  \
      }                                                           \
  while (0)

/* Backward compatibility with an undocumented macro.
   Use YYerror or YYUNDEF. */
#define YYERRCODE YYUNDEF


/* Enable debugging if requested.  */
#if YYDEBUG

# ifndef YYFPRINTF
#  include <stdio.h> /* INFRINGES ON USER NAME SPACE */
#  define YYFPRINTF fprintf
# endif

# define YYDPRINTF(Args)                        \
do {                                            \
  if (yydebug)                                  \
    YYFPRINTF Args;                             \
} while (0)




# define YY_SYMBOL_PRINT(Title, Kind, Value, Location)                    \
do {                                                                      \
  if (yydebug)                                                            \
    {                                                                     \
      YYFPRINTF (stderr, "%s ", Title);                                   \
      yy_symbol_print (stderr,                                            \
                  Kind, Value, root); \
      YYFPRINTF (stderr, "\n");                                           \
    }                                                                     \
} while (0)


/*-----------------------------------.
| Print this symbol's value on YYO.  |
`-----------------------------------*/

static void
yy_symbol_value_print (FILE *yyo,
                       yysymbol_kind_t yykind, YYSTYPE const * const yyvaluep, void* root)
{
  FILE *yyoutput = yyo;
  YY_USE (yyoutput);
  YY_USE (root);
  if (!yyvaluep)
    return;
  YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN
  YY_USE (yykind);
  YY_IGNORE_MAYBE_UNINITIALIZED_END
}


/*---------------------------.
| Print this symbol on YYO.  |
`---------------------------*/

static void
yy_symbol_print (FILE *yyo,
                 yysymbol_kind_t yykind, YYSTYPE const * const yyvaluep, void* root)
{
  YYFPRINTF (yyo, "%s %s (",
             yykind < YYNTOKENS ? "token" : "nterm", yysymbol_name (yykind));

  yy_symbol_value_print (yyo, yykind, yyvaluep, root);
  YYFPRINTF (yyo, ")");
}

/*------------------------------------------------------------------.
| yy_stack_print -- Print the state stack from its BOTTOM up to its |
| TOP (included).                                                   |
`------------------------------------------------------------------*/

static void
yy_stack_print (yy_state_t *yybottom, yy_state_t *yytop)
{
  YYFPRINTF (stderr, "Stack now");
  for (; yybottom <= yytop; yybottom++)
    {
      int yybot = *yybottom;
      YYFPRINTF (stderr, " %d", yybot);
    }
  YYFPRINTF (stderr, "\n");
}

# define YY_STACK_PRINT(Bottom, Top)                            \
do {                                                            \
  if (yydebug)                                                  \
    yy_stack_print ((Bottom), (Top));                           \
} while (0)


/*------------------------------------------------.
| Report that the YYRULE is going to be reduced.  |
`------------------------------------------------*/

static void
yy_reduce_print (yy_state_t *yyssp, YYSTYPE *yyvsp,
                 int yyrule, void* root)
{
  int yylno = yyrline[yyrule];
  int yynrhs = yyr2[yyrule];
  int yyi;
  YYFPRINTF (stderr, "Reducing stack by rule %d (line %d):\n",
             yyrule - 1, yylno);
  /* The symbols being reduced.  */
  for (yyi = 0; yyi < yynrhs; yyi++)
    {
      YYFPRINTF (stderr, "   $%d = ", yyi + 1);
      yy_symbol_print (stderr,
                       YY_ACCESSING_SYMBOL (+yyssp[yyi + 1 - yynrhs]),
                       &yyvsp[(yyi + 1) - (yynrhs)], root);
      YYFPRINTF (stderr, "\n");
    }
}

# define YY_REDUCE_PRINT(Rule)          \
do {                                    \
  if (yydebug)                          \
    yy_reduce_print (yyssp, yyvsp, Rule, root); \
} while (0)

/* Nonzero means print parse trace.  It is left uninitialized so that
   multiple parsers can coexist.  */
int yydebug;
#else /* !YYDEBUG */
# define YYDPRINTF(Args) ((void) 0)
# define YY_SYMBOL_PRINT(Title, Kind, Value, Location)
# define YY_STACK_PRINT(Bottom, Top)
# define YY_REDUCE_PRINT(Rule)
#endif /* !YYDEBUG */


/* YYINITDEPTH -- initial size of the parser's stacks.  */
#ifndef YYINITDEPTH
# define YYINITDEPTH 200
#endif

/* YYMAXDEPTH -- maximum size the stacks can grow to (effective only
   if the built-in stack extension method is used).

   Do not make this value too large; the results are undefined if
   YYSTACK_ALLOC_MAXIMUM < YYSTACK_BYTES (YYMAXDEPTH)
   evaluated with infinite-precision integer arithmetic.  */

#ifndef YYMAXDEPTH
# define YYMAXDEPTH 10000
#endif






/*-----------------------------------------------.
| Release the memory associated to this symbol.  |
`-----------------------------------------------*/

static void
yydestruct (const char *yymsg,
            yysymbol_kind_t yykind, YYSTYPE *yyvaluep, void* root)
{
  YY_USE (yyvaluep);
  YY_USE (root);
  if (!yymsg)
    yymsg = "Deleting";
  YY_SYMBOL_PRINT (yymsg, yykind, yyvaluep, yylocationp);

  YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN
  YY_USE (yykind);
  YY_IGNORE_MAYBE_UNINITIALIZED_END
}


/* Lookahead token kind.  */
int yychar;

/* The semantic value of the lookahead symbol.  */
YYSTYPE yylval;
/* Number of syntax errors so far.  */
int yynerrs;




/*----------.
| yyparse.  |
`----------*/

int
yyparse (void* root)
{
    yy_state_fast_t yystate = 0;
    /* Number of tokens to shift before error messages enabled.  */
    int yyerrstatus = 0;

    /* Refer to the stacks through separate pointers, to allow yyoverflow
       to reallocate them elsewhere.  */

    /* Their size.  */
    YYPTRDIFF_T yystacksize = YYINITDEPTH;

    /* The state stack: array, bottom, top.  */
    yy_state_t yyssa[YYINITDEPTH];
    yy_state_t *yyss = yyssa;
    yy_state_t *yyssp = yyss;

    /* The semantic value stack: array, bottom, top.  */
    YYSTYPE yyvsa[YYINITDEPTH];
    YYSTYPE *yyvs = yyvsa;
    YYSTYPE *yyvsp = yyvs;

  int yyn;
  /* The return value of yyparse.  */
  int yyresult;
  /* Lookahead symbol kind.  */
  yysymbol_kind_t yytoken = YYSYMBOL_YYEMPTY;
  /* The variables used to return semantic value and location from the
     action routines.  */
  YYSTYPE yyval;



#define YYPOPSTACK(N)   (yyvsp -= (N), yyssp -= (N))

  /* The number of symbols on the RHS of the reduced rule.
     Keep to zero when no symbol should be popped.  */
  int yylen = 0;

  YYDPRINTF ((stderr, "Starting parse\n"));

  yychar = YYEMPTY; /* Cause a token to be read.  */

  goto yysetstate;


/*------------------------------------------------------------.
| yynewstate -- push a new state, which is found in yystate.  |
`------------------------------------------------------------*/
yynewstate:
  /* In all cases, when you get here, the value and location stacks
     have just been pushed.  So pushing a state here evens the stacks.  */
  yyssp++;


/*--------------------------------------------------------------------.
| yysetstate -- set current state (the top of the stack) to yystate.  |
`--------------------------------------------------------------------*/
yysetstate:
  YYDPRINTF ((stderr, "Entering state %d\n", yystate));
  YY_ASSERT (0 <= yystate && yystate < YYNSTATES);
  YY_IGNORE_USELESS_CAST_BEGIN
  *yyssp = YY_CAST (yy_state_t, yystate);
  YY_IGNORE_USELESS_CAST_END
  YY_STACK_PRINT (yyss, yyssp);

  if (yyss + yystacksize - 1 <= yyssp)
#if !defined yyoverflow && !defined YYSTACK_RELOCATE
    YYNOMEM;
#else
    {
      /* Get the current used size of the three stacks, in elements.  */
      YYPTRDIFF_T yysize = yyssp - yyss + 1;

# if defined yyoverflow
      {
        /* Give user a chance to reallocate the stack.  Use copies of
           these so that the &'s don't force the real ones into
           memory.  */
        yy_state_t *yyss1 = yyss;
        YYSTYPE *yyvs1 = yyvs;

        /* Each stack pointer address is followed by the size of the
           data in use in that stack, in bytes.  This used to be a
           conditional around just the two extra args, but that might
           be undefined if yyoverflow is a macro.  */
        yyoverflow (YY_("memory exhausted"),
                    &yyss1, yysize * YYSIZEOF (*yyssp),
                    &yyvs1, yysize * YYSIZEOF (*yyvsp),
                    &yystacksize);
        yyss = yyss1;
        yyvs = yyvs1;
      }
# else /* defined YYSTACK_RELOCATE */
      /* Extend the stack our own way.  */
      if (YYMAXDEPTH <= yystacksize)
        YYNOMEM;
      yystacksize *= 2;
      if (YYMAXDEPTH < yystacksize)
        yystacksize = YYMAXDEPTH;

      {
        yy_state_t *yyss1 = yyss;
        union yyalloc *yyptr =
          YY_CAST (union yyalloc *,
                   YYSTACK_ALLOC (YY_CAST (YYSIZE_T, YYSTACK_BYTES (yystacksize))));
        if (! yyptr)
          YYNOMEM;
        YYSTACK_RELOCATE (yyss_alloc, yyss);
        YYSTACK_RELOCATE (yyvs_alloc, yyvs);
#  undef YYSTACK_RELOCATE
        if (yyss1 != yyssa)
          YYSTACK_FREE (yyss1);
      }
# endif

      yyssp = yyss + yysize - 1;
      yyvsp = yyvs + yysize - 1;

      YY_IGNORE_USELESS_CAST_BEGIN
      YYDPRINTF ((stderr, "Stack size increased to %ld\n",
                  YY_CAST (long, yystacksize)));
      YY_IGNORE_USELESS_CAST_END

      if (yyss + yystacksize - 1 <= yyssp)
        YYABORT;
    }
#endif /* !defined yyoverflow && !defined YYSTACK_RELOCATE */


  if (yystate == YYFINAL)
    YYACCEPT;

  goto yybackup;


/*-----------.
| yybackup.  |
`-----------*/
yybackup:
  /* Do appropriate processing given the current state.  Read a
     lookahead token if we need one and don't already have one.  */

  /* First try to decide what to do without reference to lookahead token.  */
  yyn = yypact[yystate];
  if (yypact_value_is_default (yyn))
    goto yydefault;

  /* Not known => get a lookahead token if don't already have one.  */

  /* YYCHAR is either empty, or end-of-input, or a valid lookahead.  */
  if (yychar == YYEMPTY)
    {
      YYDPRINTF ((stderr, "Reading a token\n"));
      yychar = yylex ();
    }

  if (yychar <= YYEOF)
    {
      yychar = YYEOF;
      yytoken = YYSYMBOL_YYEOF;
      YYDPRINTF ((stderr, "Now at end of input.\n"));
    }
  else if (yychar == YYerror)
    {
      /* The scanner already issued an error message, process directly
         to error recovery.  But do not keep the error token as
         lookahead, it is too special and may lead us to an endless
         loop in error recovery. */
      yychar = YYUNDEF;
      yytoken = YYSYMBOL_YYerror;
      goto yyerrlab1;
    }
  else
    {
      yytoken = YYTRANSLATE (yychar);
      YY_SYMBOL_PRINT ("Next token is", yytoken, &yylval, &yylloc);
    }

  /* If the proper action on seeing token YYTOKEN is to reduce or to
     detect an error, take that action.  */
  yyn += yytoken;
  if (yyn < 0 || YYLAST < yyn || yycheck[yyn] != yytoken)
    goto yydefault;
  yyn = yytable[yyn];
  if (yyn <= 0)
    {
      if (yytable_value_is_error (yyn))
        goto yyerrlab;
      yyn = -yyn;
      goto yyreduce;
    }

  /* Count tokens shifted since error; after three, turn off error
     status.  */
  if (yyerrstatus)
    yyerrstatus--;

  /* Shift the lookahead token.  */
  YY_SYMBOL_PRINT ("Shifting", yytoken, &yylval, &yylloc);
  yystate = yyn;
  YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN
  *++yyvsp = yylval;
  YY_IGNORE_MAYBE_UNINITIALIZED_END

  /* Discard the shifted token.  */
  yychar = YYEMPTY;
  goto yynewstate;


/*-----------------------------------------------------------.
| yydefault -- do the default action for the current state.  |
`-----------------------------------------------------------*/
yydefault:
  yyn = yydefact[yystate];
  if (yyn == 0)
    goto yyerrlab;
  goto yyreduce;


/*-----------------------------.
| yyreduce -- do a reduction.  |
`-----------------------------*/
yyreduce:
  /* yyn is the number of a rule to reduce with.  */
  yylen = yyr2[yyn];

  /* If YYLEN is nonzero, implement the default value of the action:
     '$$ = $1'.

     Otherwise, the following line sets YYVAL to garbage.
     This behavior is undocumented and Bison
     users should not rely upon it.  Assigning to YYVAL
     unconditionally makes the parser a bit smaller, and it avoids a
     GCC warning that YYVAL may be used uninitialized.  */
  yyval = yyvsp[1-yylen];


  YY_REDUCE_PRINT (yyn);
  switch (yyn)
    {
  case 2: /* program: stmt_list  */
#line 64 "parser.y"
              { *((ASTNode**)root) = (yyvsp[0].node); }
#line 1339 "parser.tab.c"
    break;

  case 3: /* program: %empty  */
#line 65 "parser.y"
                        { *((ASTNode**)root) = NULL; }
#line 1345 "parser.tab.c"
    break;

  case 4: /* stmt_list: stmt  */
#line 69 "parser.y"
         {
        (yyval.node) = create_block();
        block_add_stmt((yyval.node), (yyvsp[0].node));
    }
#line 1354 "parser.tab.c"
    break;

  case 5: /* stmt_list: stmt_list stmt  */
#line 73 "parser.y"
                     {
        (yyval.node) = (yyvsp[-1].node);
        block_add_stmt((yyval.node), (yyvsp[0].node));
    }
#line 1363 "parser.tab.c"
    break;

  case 6: /* stmt: var_decl TOK_SEMI  */
#line 80 "parser.y"
                      { (yyval.node) = (yyvsp[-1].node); }
#line 1369 "parser.tab.c"
    break;

  case 7: /* stmt: expr TOK_SEMI  */
#line 81 "parser.y"
                    { (yyval.node) = (yyvsp[-1].node); }
#line 1375 "parser.tab.c"
    break;

  case 8: /* stmt: func_decl  */
#line 82 "parser.y"
                { (yyval.node) = (yyvsp[0].node); }
#line 1381 "parser.tab.c"
    break;

  case 9: /* stmt: if_stmt  */
#line 83 "parser.y"
              { (yyval.node) = (yyvsp[0].node); }
#line 1387 "parser.tab.c"
    break;

  case 10: /* stmt: while_stmt  */
#line 84 "parser.y"
                 { (yyval.node) = (yyvsp[0].node); }
#line 1393 "parser.tab.c"
    break;

  case 11: /* stmt: for_stmt  */
#line 85 "parser.y"
               { (yyval.node) = (yyvsp[0].node); }
#line 1399 "parser.tab.c"
    break;

  case 12: /* stmt: return_stmt TOK_SEMI  */
#line 86 "parser.y"
                           { (yyval.node) = (yyvsp[-1].node); }
#line 1405 "parser.tab.c"
    break;

  case 13: /* stmt: print_stmt TOK_SEMI  */
#line 87 "parser.y"
                          { (yyval.node) = (yyvsp[-1].node); }
#line 1411 "parser.tab.c"
    break;

  case 14: /* stmt: block  */
#line 88 "parser.y"
            { (yyval.node) = (yyvsp[0].node); }
#line 1417 "parser.tab.c"
    break;

  case 15: /* block: TOK_LBRACE stmt_list TOK_RBRACE  */
#line 92 "parser.y"
                                    { (yyval.node) = (yyvsp[-1].node); }
#line 1423 "parser.tab.c"
    break;

  case 16: /* block: TOK_LBRACE TOK_RBRACE  */
#line 93 "parser.y"
                            { (yyval.node) = create_block(); }
#line 1429 "parser.tab.c"
    break;

  case 17: /* type: base_type  */
#line 97 "parser.y"
              { (yyval.vtype) = (yyvsp[0].vtype); }
#line 1435 "parser.tab.c"
    break;

  case 18: /* type: base_type TOK_LBRACKET TOK_RBRACKET  */
#line 98 "parser.y"
                                          {
        if ((yyvsp[-2].vtype) == VAL_INT) (yyval.vtype) = VAL_INT_ARRAY;
        else if ((yyvsp[-2].vtype) == VAL_FLOAT) (yyval.vtype) = VAL_FLOAT_ARRAY;
        else if ((yyvsp[-2].vtype) == VAL_STRING) (yyval.vtype) = VAL_STRING_ARRAY;
        else if ((yyvsp[-2].vtype) == VAL_BOOL) (yyval.vtype) = VAL_BOOL_ARRAY;
        else if ((yyvsp[-2].vtype) == VAL_CHAR) (yyval.vtype) = VAL_CHAR_ARRAY;
        else if ((yyvsp[-2].vtype) == VAL_DYNAMIC) (yyval.vtype) = VAL_DYNAMIC_ARRAY;
        else (yyval.vtype) = VAL_DYNAMIC_ARRAY;
    }
#line 1449 "parser.tab.c"
    break;

  case 19: /* base_type: TOK_TYPE_INT  */
#line 110 "parser.y"
                 { (yyval.vtype) = VAL_INT; }
#line 1455 "parser.tab.c"
    break;

  case 20: /* base_type: TOK_TYPE_FLOAT  */
#line 111 "parser.y"
                     { (yyval.vtype) = VAL_FLOAT; }
#line 1461 "parser.tab.c"
    break;

  case 21: /* base_type: TOK_TYPE_STRING  */
#line 112 "parser.y"
                      { (yyval.vtype) = VAL_STRING; }
#line 1467 "parser.tab.c"
    break;

  case 22: /* base_type: TOK_TYPE_BOOL  */
#line 113 "parser.y"
                    { (yyval.vtype) = VAL_BOOL; }
#line 1473 "parser.tab.c"
    break;

  case 23: /* base_type: TOK_TYPE_CHAR  */
#line 114 "parser.y"
                    { (yyval.vtype) = VAL_CHAR; }
#line 1479 "parser.tab.c"
    break;

  case 24: /* base_type: TOK_TYPE_VOID  */
#line 115 "parser.y"
                    { (yyval.vtype) = VAL_VOID; }
#line 1485 "parser.tab.c"
    break;

  case 25: /* base_type: TOK_TYPE_DYNAMIC  */
#line 116 "parser.y"
                       { (yyval.vtype) = VAL_DYNAMIC; }
#line 1491 "parser.tab.c"
    break;

  case 26: /* var_decl: type TOK_IDENTIFIER  */
#line 120 "parser.y"
                        {
        (yyval.node) = create_var_decl((yyvsp[-1].vtype), (yyvsp[0].sval), NULL);
        free((yyvsp[0].sval));
    }
#line 1500 "parser.tab.c"
    break;

  case 27: /* var_decl: type TOK_IDENTIFIER TOK_ASSIGN expr  */
#line 124 "parser.y"
                                          {
        (yyval.node) = create_var_decl((yyvsp[-3].vtype), (yyvsp[-2].sval), (yyvsp[0].node));
        free((yyvsp[-2].sval));
    }
#line 1509 "parser.tab.c"
    break;

  case 28: /* func_decl: TOK_FUNC type TOK_IDENTIFIER TOK_LPAREN params TOK_RPAREN block  */
#line 131 "parser.y"
                                                                    {
        (yyval.node) = create_func_decl((yyvsp[-5].vtype), (yyvsp[-4].sval), (yyvsp[-2].plist).count, (yyvsp[-2].plist).names, (yyvsp[-2].plist).types, (yyvsp[0].node));
        free((yyvsp[-4].sval));
    }
#line 1518 "parser.tab.c"
    break;

  case 29: /* params: param_list  */
#line 138 "parser.y"
               { (yyval.plist) = (yyvsp[0].plist); }
#line 1524 "parser.tab.c"
    break;

  case 30: /* params: %empty  */
#line 139 "parser.y"
                        { (yyval.plist).count = 0; (yyval.plist).names = NULL; (yyval.plist).types = NULL; }
#line 1530 "parser.tab.c"
    break;

  case 31: /* param_list: type TOK_IDENTIFIER  */
#line 143 "parser.y"
                        {
        (yyval.plist).count = 1;
        (yyval.plist).names = (char**)malloc(sizeof(char*));
        (yyval.plist).types = (ValueType*)malloc(sizeof(ValueType));
        (yyval.plist).names[0] = strdup((yyvsp[0].sval));
        (yyval.plist).types[0] = (yyvsp[-1].vtype);
        free((yyvsp[0].sval));
    }
#line 1543 "parser.tab.c"
    break;

  case 32: /* param_list: param_list TOK_COMMA type TOK_IDENTIFIER  */
#line 151 "parser.y"
                                               {
        (yyval.plist).count = (yyvsp[-3].plist).count + 1;
        (yyval.plist).names = (char**)realloc((yyvsp[-3].plist).names, (yyval.plist).count * sizeof(char*));
        (yyval.plist).types = (ValueType*)realloc((yyvsp[-3].plist).types, (yyval.plist).count * sizeof(ValueType));
        (yyval.plist).names[(yyval.plist).count - 1] = strdup((yyvsp[0].sval));
        (yyval.plist).types[(yyval.plist).count - 1] = (yyvsp[-1].vtype);
        free((yyvsp[0].sval));
    }
#line 1556 "parser.tab.c"
    break;

  case 33: /* if_stmt: TOK_IF TOK_LPAREN expr TOK_RPAREN block  */
#line 162 "parser.y"
                                            {
        (yyval.node) = create_if((yyvsp[-2].node), (yyvsp[0].node), NULL);
    }
#line 1564 "parser.tab.c"
    break;

  case 34: /* if_stmt: TOK_IF TOK_LPAREN expr TOK_RPAREN block TOK_ELSE block  */
#line 165 "parser.y"
                                                             {
        (yyval.node) = create_if((yyvsp[-4].node), (yyvsp[-2].node), (yyvsp[0].node));
    }
#line 1572 "parser.tab.c"
    break;

  case 35: /* if_stmt: TOK_IF TOK_LPAREN expr TOK_RPAREN block TOK_ELSE if_stmt  */
#line 168 "parser.y"
                                                               {
        (yyval.node) = create_if((yyvsp[-4].node), (yyvsp[-2].node), (yyvsp[0].node));
    }
#line 1580 "parser.tab.c"
    break;

  case 36: /* while_stmt: TOK_WHILE TOK_LPAREN expr TOK_RPAREN block  */
#line 174 "parser.y"
                                               {
        (yyval.node) = create_while((yyvsp[-2].node), (yyvsp[0].node));
    }
#line 1588 "parser.tab.c"
    break;

  case 37: /* for_stmt: TOK_FOR TOK_LPAREN var_decl TOK_SEMI expr TOK_SEMI expr TOK_RPAREN block  */
#line 180 "parser.y"
                                                                             {
        (yyval.node) = create_for((yyvsp[-6].node), (yyvsp[-4].node), (yyvsp[-2].node), (yyvsp[0].node));
    }
#line 1596 "parser.tab.c"
    break;

  case 38: /* for_stmt: TOK_FOR TOK_LPAREN expr TOK_SEMI expr TOK_SEMI expr TOK_RPAREN block  */
#line 183 "parser.y"
                                                                           {
        (yyval.node) = create_for((yyvsp[-6].node), (yyvsp[-4].node), (yyvsp[-2].node), (yyvsp[0].node));
    }
#line 1604 "parser.tab.c"
    break;

  case 39: /* for_stmt: TOK_FOR TOK_LPAREN TOK_SEMI expr TOK_SEMI expr TOK_RPAREN block  */
#line 186 "parser.y"
                                                                      {
        (yyval.node) = create_for(NULL, (yyvsp[-4].node), (yyvsp[-2].node), (yyvsp[0].node));
    }
#line 1612 "parser.tab.c"
    break;

  case 40: /* for_stmt: TOK_FOR TOK_LPAREN var_decl TOK_SEMI expr TOK_SEMI TOK_RPAREN block  */
#line 189 "parser.y"
                                                                          {
        (yyval.node) = create_for((yyvsp[-5].node), (yyvsp[-3].node), NULL, (yyvsp[0].node));
    }
#line 1620 "parser.tab.c"
    break;

  case 41: /* for_stmt: TOK_FOR TOK_LPAREN expr TOK_SEMI expr TOK_SEMI TOK_RPAREN block  */
#line 192 "parser.y"
                                                                      {
        (yyval.node) = create_for((yyvsp[-5].node), (yyvsp[-3].node), NULL, (yyvsp[0].node));
    }
#line 1628 "parser.tab.c"
    break;

  case 42: /* for_stmt: TOK_FOR TOK_LPAREN TOK_SEMI expr TOK_SEMI TOK_RPAREN block  */
#line 195 "parser.y"
                                                                 {
        (yyval.node) = create_for(NULL, (yyvsp[-3].node), NULL, (yyvsp[0].node));
    }
#line 1636 "parser.tab.c"
    break;

  case 43: /* return_stmt: TOK_RETURN expr  */
#line 201 "parser.y"
                    { (yyval.node) = create_return((yyvsp[0].node)); }
#line 1642 "parser.tab.c"
    break;

  case 44: /* return_stmt: TOK_RETURN  */
#line 202 "parser.y"
                 { (yyval.node) = create_return(create_null_node()); }
#line 1648 "parser.tab.c"
    break;

  case 45: /* print_stmt: TOK_PRINT TOK_LPAREN expr TOK_RPAREN  */
#line 206 "parser.y"
                                         { (yyval.node) = create_print((yyvsp[-1].node)); }
#line 1654 "parser.tab.c"
    break;

  case 46: /* expr: TOK_INT_LIT  */
#line 210 "parser.y"
                { (yyval.node) = create_int_node((yyvsp[0].ival)); }
#line 1660 "parser.tab.c"
    break;

  case 47: /* expr: TOK_FLOAT_LIT  */
#line 211 "parser.y"
                    { (yyval.node) = create_float_node((yyvsp[0].fval)); }
#line 1666 "parser.tab.c"
    break;

  case 48: /* expr: TOK_CHAR_LIT  */
#line 212 "parser.y"
                   { (yyval.node) = create_char_node((char)(yyvsp[0].ival)); }
#line 1672 "parser.tab.c"
    break;

  case 49: /* expr: TOK_STR_LIT  */
#line 213 "parser.y"
                  { (yyval.node) = create_string_node((yyvsp[0].sval)); free((yyvsp[0].sval)); }
#line 1678 "parser.tab.c"
    break;

  case 50: /* expr: TOK_TRUE  */
#line 214 "parser.y"
               { (yyval.node) = create_bool_node(true); }
#line 1684 "parser.tab.c"
    break;

  case 51: /* expr: TOK_FALSE  */
#line 215 "parser.y"
                { (yyval.node) = create_bool_node(false); }
#line 1690 "parser.tab.c"
    break;

  case 52: /* expr: TOK_NULL  */
#line 216 "parser.y"
               { (yyval.node) = create_null_node(); }
#line 1696 "parser.tab.c"
    break;

  case 53: /* expr: TOK_IDENTIFIER  */
#line 217 "parser.y"
                     { (yyval.node) = create_var_access((yyvsp[0].sval)); free((yyvsp[0].sval)); }
#line 1702 "parser.tab.c"
    break;

  case 54: /* expr: TOK_IDENTIFIER TOK_ASSIGN expr  */
#line 218 "parser.y"
                                     { (yyval.node) = create_assign((yyvsp[-2].sval), (yyvsp[0].node)); free((yyvsp[-2].sval)); }
#line 1708 "parser.tab.c"
    break;

  case 55: /* expr: func_call  */
#line 219 "parser.y"
                { (yyval.node) = (yyvsp[0].node); }
#line 1714 "parser.tab.c"
    break;

  case 56: /* expr: expr TOK_PLUS expr  */
#line 220 "parser.y"
                         { (yyval.node) = create_binop(OP_PLUS, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1720 "parser.tab.c"
    break;

  case 57: /* expr: expr TOK_MINUS expr  */
#line 221 "parser.y"
                          { (yyval.node) = create_binop(OP_MINUS, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1726 "parser.tab.c"
    break;

  case 58: /* expr: expr TOK_MUL expr  */
#line 222 "parser.y"
                        { (yyval.node) = create_binop(OP_MUL, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1732 "parser.tab.c"
    break;

  case 59: /* expr: expr TOK_DIV expr  */
#line 223 "parser.y"
                        { (yyval.node) = create_binop(OP_DIV, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1738 "parser.tab.c"
    break;

  case 60: /* expr: expr TOK_MOD expr  */
#line 224 "parser.y"
                        { (yyval.node) = create_binop(OP_MOD, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1744 "parser.tab.c"
    break;

  case 61: /* expr: expr TOK_EQ expr  */
#line 225 "parser.y"
                       { (yyval.node) = create_binop(OP_EQ, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1750 "parser.tab.c"
    break;

  case 62: /* expr: expr TOK_NEQ expr  */
#line 226 "parser.y"
                        { (yyval.node) = create_binop(OP_NEQ, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1756 "parser.tab.c"
    break;

  case 63: /* expr: expr TOK_LT expr  */
#line 227 "parser.y"
                       { (yyval.node) = create_binop(OP_LT, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1762 "parser.tab.c"
    break;

  case 64: /* expr: expr TOK_GT expr  */
#line 228 "parser.y"
                       { (yyval.node) = create_binop(OP_GT, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1768 "parser.tab.c"
    break;

  case 65: /* expr: expr TOK_LE expr  */
#line 229 "parser.y"
                       { (yyval.node) = create_binop(OP_LE, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1774 "parser.tab.c"
    break;

  case 66: /* expr: expr TOK_GE expr  */
#line 230 "parser.y"
                       { (yyval.node) = create_binop(OP_GE, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1780 "parser.tab.c"
    break;

  case 67: /* expr: expr TOK_AND expr  */
#line 231 "parser.y"
                        { (yyval.node) = create_binop(OP_AND, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1786 "parser.tab.c"
    break;

  case 68: /* expr: expr TOK_OR expr  */
#line 232 "parser.y"
                       { (yyval.node) = create_binop(OP_OR, (yyvsp[-2].node), (yyvsp[0].node)); }
#line 1792 "parser.tab.c"
    break;

  case 69: /* expr: TOK_LPAREN expr TOK_RPAREN  */
#line 233 "parser.y"
                                 { (yyval.node) = (yyvsp[-1].node); }
#line 1798 "parser.tab.c"
    break;

  case 70: /* expr: TOK_LBRACKET args TOK_RBRACKET  */
#line 234 "parser.y"
                                     { (yyval.node) = create_array_literal((yyvsp[-1].alist).args, (yyvsp[-1].alist).count); }
#line 1804 "parser.tab.c"
    break;

  case 71: /* expr: expr TOK_LBRACKET expr TOK_RBRACKET  */
#line 235 "parser.y"
                                          { (yyval.node) = create_array_access((yyvsp[-3].node), (yyvsp[-1].node)); }
#line 1810 "parser.tab.c"
    break;

  case 72: /* expr: expr TOK_LBRACKET expr TOK_RBRACKET TOK_ASSIGN expr  */
#line 236 "parser.y"
                                                          { (yyval.node) = create_array_assign((yyvsp[-5].node), (yyvsp[-3].node), (yyvsp[0].node)); }
#line 1816 "parser.tab.c"
    break;

  case 73: /* func_call: TOK_IDENTIFIER TOK_LPAREN args TOK_RPAREN  */
#line 240 "parser.y"
                                              {
        (yyval.node) = create_func_call((yyvsp[-3].sval), (yyvsp[-1].alist).count, (yyvsp[-1].alist).args);
        free((yyvsp[-3].sval));
    }
#line 1825 "parser.tab.c"
    break;

  case 74: /* args: arg_list  */
#line 247 "parser.y"
             { (yyval.alist) = (yyvsp[0].alist); }
#line 1831 "parser.tab.c"
    break;

  case 75: /* args: %empty  */
#line 248 "parser.y"
                        { (yyval.alist).count = 0; (yyval.alist).args = NULL; }
#line 1837 "parser.tab.c"
    break;

  case 76: /* arg_list: expr  */
#line 252 "parser.y"
         {
        (yyval.alist).count = 1;
        (yyval.alist).args = (ASTNode**)malloc(sizeof(ASTNode*));
        (yyval.alist).args[0] = (yyvsp[0].node);
    }
#line 1847 "parser.tab.c"
    break;

  case 77: /* arg_list: arg_list TOK_COMMA expr  */
#line 257 "parser.y"
                              {
        (yyval.alist).count = (yyvsp[-2].alist).count + 1;
        (yyval.alist).args = (ASTNode**)realloc((yyvsp[-2].alist).args, (yyval.alist).count * sizeof(ASTNode*));
        (yyval.alist).args[(yyval.alist).count - 1] = (yyvsp[0].node);
    }
#line 1857 "parser.tab.c"
    break;


#line 1861 "parser.tab.c"

      default: break;
    }
  /* User semantic actions sometimes alter yychar, and that requires
     that yytoken be updated with the new translation.  We take the
     approach of translating immediately before every use of yytoken.
     One alternative is translating here after every semantic action,
     but that translation would be missed if the semantic action invokes
     YYABORT, YYACCEPT, or YYERROR immediately after altering yychar or
     if it invokes YYBACKUP.  In the case of YYABORT or YYACCEPT, an
     incorrect destructor might then be invoked immediately.  In the
     case of YYERROR or YYBACKUP, subsequent parser actions might lead
     to an incorrect destructor call or verbose syntax error message
     before the lookahead is translated.  */
  YY_SYMBOL_PRINT ("-> $$ =", YY_CAST (yysymbol_kind_t, yyr1[yyn]), &yyval, &yyloc);

  YYPOPSTACK (yylen);
  yylen = 0;

  *++yyvsp = yyval;

  /* Now 'shift' the result of the reduction.  Determine what state
     that goes to, based on the state we popped back to and the rule
     number reduced by.  */
  {
    const int yylhs = yyr1[yyn] - YYNTOKENS;
    const int yyi = yypgoto[yylhs] + *yyssp;
    yystate = (0 <= yyi && yyi <= YYLAST && yycheck[yyi] == *yyssp
               ? yytable[yyi]
               : yydefgoto[yylhs]);
  }

  goto yynewstate;


/*--------------------------------------.
| yyerrlab -- here on detecting error.  |
`--------------------------------------*/
yyerrlab:
  /* Make sure we have latest lookahead translation.  See comments at
     user semantic actions for why this is necessary.  */
  yytoken = yychar == YYEMPTY ? YYSYMBOL_YYEMPTY : YYTRANSLATE (yychar);
  /* If not already recovering from an error, report this error.  */
  if (!yyerrstatus)
    {
      ++yynerrs;
      yyerror (root, YY_("syntax error"));
    }

  if (yyerrstatus == 3)
    {
      /* If just tried and failed to reuse lookahead token after an
         error, discard it.  */

      if (yychar <= YYEOF)
        {
          /* Return failure if at end of input.  */
          if (yychar == YYEOF)
            YYABORT;
        }
      else
        {
          yydestruct ("Error: discarding",
                      yytoken, &yylval, root);
          yychar = YYEMPTY;
        }
    }

  /* Else will try to reuse lookahead token after shifting the error
     token.  */
  goto yyerrlab1;


/*---------------------------------------------------.
| yyerrorlab -- error raised explicitly by YYERROR.  |
`---------------------------------------------------*/
yyerrorlab:
  /* Pacify compilers when the user code never invokes YYERROR and the
     label yyerrorlab therefore never appears in user code.  */
  if (0)
    YYERROR;
  ++yynerrs;

  /* Do not reclaim the symbols of the rule whose action triggered
     this YYERROR.  */
  YYPOPSTACK (yylen);
  yylen = 0;
  YY_STACK_PRINT (yyss, yyssp);
  yystate = *yyssp;
  goto yyerrlab1;


/*-------------------------------------------------------------.
| yyerrlab1 -- common code for both syntax error and YYERROR.  |
`-------------------------------------------------------------*/
yyerrlab1:
  yyerrstatus = 3;      /* Each real token shifted decrements this.  */

  /* Pop stack until we find a state that shifts the error token.  */
  for (;;)
    {
      yyn = yypact[yystate];
      if (!yypact_value_is_default (yyn))
        {
          yyn += YYSYMBOL_YYerror;
          if (0 <= yyn && yyn <= YYLAST && yycheck[yyn] == YYSYMBOL_YYerror)
            {
              yyn = yytable[yyn];
              if (0 < yyn)
                break;
            }
        }

      /* Pop the current state because it cannot handle the error token.  */
      if (yyssp == yyss)
        YYABORT;


      yydestruct ("Error: popping",
                  YY_ACCESSING_SYMBOL (yystate), yyvsp, root);
      YYPOPSTACK (1);
      yystate = *yyssp;
      YY_STACK_PRINT (yyss, yyssp);
    }

  YY_IGNORE_MAYBE_UNINITIALIZED_BEGIN
  *++yyvsp = yylval;
  YY_IGNORE_MAYBE_UNINITIALIZED_END


  /* Shift the error token.  */
  YY_SYMBOL_PRINT ("Shifting", YY_ACCESSING_SYMBOL (yyn), yyvsp, yylsp);

  yystate = yyn;
  goto yynewstate;


/*-------------------------------------.
| yyacceptlab -- YYACCEPT comes here.  |
`-------------------------------------*/
yyacceptlab:
  yyresult = 0;
  goto yyreturnlab;


/*-----------------------------------.
| yyabortlab -- YYABORT comes here.  |
`-----------------------------------*/
yyabortlab:
  yyresult = 1;
  goto yyreturnlab;


/*-----------------------------------------------------------.
| yyexhaustedlab -- YYNOMEM (memory exhaustion) comes here.  |
`-----------------------------------------------------------*/
yyexhaustedlab:
  yyerror (root, YY_("memory exhausted"));
  yyresult = 2;
  goto yyreturnlab;


/*----------------------------------------------------------.
| yyreturnlab -- parsing is finished, clean up and return.  |
`----------------------------------------------------------*/
yyreturnlab:
  if (yychar != YYEMPTY)
    {
      /* Make sure we have latest lookahead translation.  See comments at
         user semantic actions for why this is necessary.  */
      yytoken = YYTRANSLATE (yychar);
      yydestruct ("Cleanup: discarding lookahead",
                  yytoken, &yylval, root);
    }
  /* Do not reclaim the symbols of the rule whose action triggered
     this YYABORT or YYACCEPT.  */
  YYPOPSTACK (yylen);
  YY_STACK_PRINT (yyss, yyssp);
  while (yyssp != yyss)
    {
      yydestruct ("Cleanup: popping",
                  YY_ACCESSING_SYMBOL (+*yyssp), yyvsp, root);
      YYPOPSTACK (1);
    }
#ifndef yyoverflow
  if (yyss != yyssa)
    YYSTACK_FREE (yyss);
#endif

  return yyresult;
}

#line 264 "parser.y"


