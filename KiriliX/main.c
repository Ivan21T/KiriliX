#include <stdio.h>
#include <stdlib.h>
#include "ast.h"
#include "env.h"
#include "interpreter.h"


extern int yyparse(void* root);
extern FILE* yyin;

int main(int argc, char** argv) {
    if (argc < 2) {
        printf("Употреба: %s <файл.bg>\n", argv[0]);
        return 1;
    }

    FILE* file = fopen(argv[1], "r");
    if (!file) {
        printf("Грешка: Не може да се отвори файл %s\n", argv[1]);
        return 1;
    }

    yyin = file;
    ASTNode* root = NULL;
    
    printf("Парсване на %s...\n", argv[1]);
    if (yyparse((void*)&root) != 0) {
        printf("Грешка по време на синтактичния анализ.\n");
        fclose(file);
        return 1;
    }
    fclose(file);
    
    if (root == NULL) {
        printf("Празен файл.\n");
        return 0;
    }

    
    Env* global_env = create_env(NULL);
    init_stdlib(global_env);
    
    eval(root, global_env);
    
    ASTNode* main_func = env_get_func(global_env, "главна");
    if (main_func) {
        ASTNode* call_main = create_func_call("главна", 0, NULL);
        eval(call_main, global_env);
        free_ast(call_main);
    } else {
        printf("Внимание: Не е намерена функция 'главна'.\n");
    }

    free_ast(root);
    free_env(global_env);
    
    return 0;
}
