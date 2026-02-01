%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* =========================
   ТИПОВЕ
   ========================= */
typedef enum {
    T_INT,
    T_FLOAT,
    T_STRING,
    T_CHAR
} VarType;

typedef struct {
    VarType type;
    union {
        int i;
        float f;
        char c;
        char *s;
    };
} Value;

/* =========================
   ДИНАМИЧНА ХЕШ-ТАБЛИЦА
   ========================= */
typedef struct Variable {
    char *name;
    VarType type;
    Value value;
    struct Variable *next; // chain за колизии
} Variable;

typedef struct {
    Variable **buckets;
    size_t size;
    size_t count;
} HashTable;

typedef struct Scope {
    HashTable table;
    struct Scope *next;
} Scope;

Scope *scope_stack = NULL;

/* =========================
   ХЕШ ФУНКЦИЯ
   ========================= */
unsigned long hash(char *str) {
    unsigned long hash = 5381;
    int c;
    while ((c = *str++))
        hash = ((hash << 5) + hash) + c;
    return hash;
}

/* =========================
   INITIALIZE
   ========================= */
void init_table(HashTable *ht, size_t initial_size) {
    ht->size = initial_size;
    ht->count = 0;
    ht->buckets = calloc(ht->size, sizeof(Variable*));
    if (!ht->buckets) { printf("Грешка: памет\n"); exit(1); }
}

/* =========================
   RESIZE
   ========================= */
void resize_table(HashTable *ht) {
    size_t new_size = ht->size * 2;
    Variable **new_buckets = calloc(new_size, sizeof(Variable*));

    for (size_t i = 0; i < ht->size; i++) {
        Variable *curr = ht->buckets[i];
        while (curr) {
            Variable *next = curr->next;
            unsigned long h = hash(curr->name) % new_size;
            curr->next = new_buckets[h];
            new_buckets[h] = curr;
            curr = next;
        }
    }

    free(ht->buckets);
    ht->buckets = new_buckets;
    ht->size = new_size;
}

/* =========================
   SCOPE STACK
   ========================= */
void push_scope() {
    Scope *s = malloc(sizeof(Scope));
    init_table(&s->table, 16);
    s->next = scope_stack;
    scope_stack = s;
}

void pop_scope() {
    if (!scope_stack) return;
    Scope *s = scope_stack;
    for (size_t i = 0; i < s->table.size; i++) {
        Variable *curr = s->table.buckets[i];
        while (curr) {
            Variable *next = curr->next;
            free(curr->name);
            if (curr->type == T_STRING) free(curr->value.s);
            free(curr);
            curr = next;
        }
    }
    free(s->table.buckets);
    scope_stack = s->next;
    free(s);
}

/* =========================
   DECLARE / ASSIGN / FIND
   ========================= */
Variable* find_var_scope(char *name) {
    for (Scope *s = scope_stack; s != NULL; s = s->next) {
        unsigned long h = hash(name) % s->table.size;
        Variable *curr = s->table.buckets[h];
        while (curr) {
            if (strcmp(curr->name, name) == 0) return curr;
            curr = curr->next;
        }
    }
    return NULL;
}

void declare_var(char *name, VarType type, Value v) {
    if (!scope_stack) push_scope();
    Scope *s = scope_stack;
    unsigned long h = hash(name) % s->table.size;
    Variable *curr = s->table.buckets[h];
    while (curr) {
        if (strcmp(curr->name, name) == 0) {
            printf("Грешка: променливата %s вече съществува в този scope\n", name);
            exit(1);
        }
        curr = curr->next;
    }
    Variable *var = malloc(sizeof(Variable));
    var->name = strdup(name);
    var->type = type;
    var->value = v;
    var->next = s->table.buckets[h];
    s->table.buckets[h] = var;
    s->table.count++;
    if ((float)s->table.count / s->table.size > 0.75) resize_table(&s->table);
}

void assign_var(char *name, Value v) {
    Variable *var = find_var_scope(name);
    if (!var) { printf("Грешка: неизвестна променлива %s\n", name); exit(1); }
    if (var->type != v.type) { printf("Типова грешка при %s\n", name); exit(1); }
    var->value = v;
}

/* ========================= */

int yylex(void);
void yyerror(const char *s);
%}

%union {
    int inum;
    float fnum;
    char ch;
    char *str;
    char *id;
    Value val;
}

%token TYPE_INT TYPE_FLOAT TYPE_STRING TYPE_CHAR
%token IDENTIFIER
%token INT_NUMBER FLOAT_NUMBER STRING_LITERAL CHAR_LITERAL
%token PRINT

%type <val> expr

%left '+' '-'
%left '*' '/'

%%

program:
    statements
;

statements:
      statements statement
    | statement
;

statement:
      TYPE_INT IDENTIFIER '=' expr ';'
        { if ($4.type != T_INT) yyerror("очаква се цяло число"); declare_var($2, T_INT, $4); }
    | TYPE_FLOAT IDENTIFIER '=' expr ';'
        { if ($4.type != T_FLOAT) yyerror("очаква се дробно число"); declare_var($2, T_FLOAT, $4); }
    | TYPE_STRING IDENTIFIER '=' expr ';'
        { if ($4.type != T_STRING) yyerror("очаква се текст"); declare_var($2, T_STRING, $4); }
    | TYPE_CHAR IDENTIFIER '=' expr ';'
        { if ($4.type != T_CHAR) yyerror("очаква се символ"); declare_var($2, T_CHAR, $4); }

    | IDENTIFIER '=' expr ';'
        { assign_var($1, $3); }

    | PRINT '(' expr ')' ';'
        {
            switch ($3.type) {
                case T_INT:    printf("%d\n", $3.i); break;
                case T_FLOAT:  printf("%f\n", $3.f); break;
                case T_STRING: printf("%s\n", $3.s); break;
                case T_CHAR:   printf("%c\n", $3.c); break;
            }
        }

    | '{' { push_scope(); } statements '}' { pop_scope(); }
;

expr:
      INT_NUMBER   { $$ = (Value){ T_INT, .i = $1 }; }
    | FLOAT_NUMBER { $$ = (Value){ T_FLOAT, .f = $1 }; }
    | STRING_LITERAL { $$ = (Value){ T_STRING, .s = $1 }; }
    | CHAR_LITERAL { $$ = (Value){ T_CHAR, .c = $1 }; }
    | IDENTIFIER
        {
            Variable *v = find_var_scope($1);
            if (!v) { printf("Грешка: %s не е дефинирана\n", $1); exit(1); }
            $$ = v->value;
        }
    | expr '+' expr
        {
            if ($1.type == T_INT && $3.type == T_INT) $$ = (Value){ T_INT, .i = $1.i + $3.i };
            else if ($1.type == T_FLOAT || $3.type == T_FLOAT)
                $$ = (Value){ T_FLOAT, .f = ($1.type==T_FLOAT?$1.f:$1.i)+($3.type==T_FLOAT?$3.f:$3.i) };
            else if ($1.type == T_STRING && $3.type == T_STRING)
                $$ = (Value){ T_STRING, .s = strcat(strdup($1.s), $3.s) };
            else yyerror("невалидно събиране");
        }
    | expr '-' expr
        {
            if ($1.type == T_INT && $3.type == T_INT) $$ = (Value){ T_INT, .i = $1.i - $3.i };
            else if ($1.type == T_FLOAT || $3.type == T_FLOAT)
                $$ = (Value){ T_FLOAT, .f = ($1.type==T_FLOAT?$1.f:$1.i)-($3.type==T_FLOAT?$3.f:$3.i) };
            else yyerror("невалидно изваждане");
        }
    | expr '*' expr
        {
            if ($1.type == T_INT && $3.type == T_INT) $$ = (Value){ T_INT, .i = $1.i * $3.i };
            else if ($1.type == T_FLOAT || $3.type == T_FLOAT)
                $$ = (Value){ T_FLOAT, .f = ($1.type==T_FLOAT?$1.f:$1.i)*($3.type==T_FLOAT?$3.f:$3.i) };
            else yyerror("невалидно умножение");
        }
    | expr '/' expr
        {
            if ($1.type == T_INT && $3.type == T_INT) $$ = (Value){ T_INT, .i = $1.i / $3.i };
            else if ($1.type == T_FLOAT || $3.type == T_FLOAT)
                $$ = (Value){ T_FLOAT, .f = ($1.type==T_FLOAT?$1.f:$1.i)/($3.type==T_FLOAT?$3.f:$3.i) };
            else yyerror("невалидно деление");
        }
    | '(' expr ')' { $$ = $2; }
;

%%

void yyerror(const char *s) {
    printf("Грешка: %s\n", s);
    exit(1);
}

int main(int argc, char **argv) {
    push_scope(); // глобална таблица

    if (argc < 2) { printf("Usage: %s filename.kx\n", argv[0]); return 1; }
    FILE *file = fopen(argv[1], "r");
    if (!file) { printf("Грешка: не мога да отворя файла %s\n", argv[1]); return 1; }

    yyin = file;
    int result = yyparse();
    fclose(file);
    return result;
}
