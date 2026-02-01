// src/main.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include "lexer/tokens.h"
#include "parser/parser.h"
#include "interpreter/interpreter.h"

extern FILE* yyin;
extern int yyparse(void* scanner, ASTNode** ast);
extern void* kx_lex_init(FILE* input);
extern void kx_lex_destroy(void* scanner);

static Interpreter* global_interpreter = NULL;

void handle_sigint(int sig) {
    if (global_interpreter) {
        printf("\nПрограмата беше прекъсната от потребителя.\n");
        free_interpreter(global_interpreter);
        exit(1);
    }
}

void run_file(const char* filename) {
    FILE* file = fopen(filename, "r");
    if (!file) {
        fprintf(stderr, "Грешка: Не може да се отвори файл '%s'\n", filename);
        exit(1);
    }
    
    // Initialize lexer
    void* scanner = kx_lex_init(file);
    
    ASTNode* ast = NULL;
    
    printf("Зареждане на файл: %s\n", filename);
    
    if (yyparse(scanner, &ast) != 0 || !ast) {
        fprintf(stderr, "Грешка при парсване на файла.\n");
        fclose(file);
        kx_lex_destroy(scanner);
        exit(1);
    }
    
    fclose(file);
    kx_lex_destroy(scanner);
    
    // Create and configure interpreter
    Interpreter* interpreter = create_interpreter();
    global_interpreter = interpreter;
    
    // Register signal handler
    signal(SIGINT, handle_sigint);
    
    // Register built-in functions
    register_builtins(interpreter);
    
    printf("Изпълнение...\n");
    printf("====================\n");
    
    // Execute program
    Value result = interpret(interpreter, ast);
    
    printf("====================\n");
    
    if (interpreter->control.has_error) {
        fprintf(stderr, "Грешка при изпълнение: %s\n", interpreter->control.error_message);
        free_interpreter(interpreter);
        free_ast(ast);
        exit(1);
    }
    
    if (result.type == VAL_ERROR) {
        char* error_msg = value_to_string(result);
        fprintf(stderr, "Грешка: %s\n", error_msg);
        free(error_msg);
    } else if (result.type != VAL_NULL) {
        char* result_str = value_to_string(result);
        printf("Резултат: %s\n", result_str);
        free(result_str);
    }
    
    free_value(result);
    free_interpreter(interpreter);
    free_ast(ast);
    
    global_interpreter = NULL;
}

void run_repl() {
    printf("╔═══════════════════════════════════════════╗\n");
    printf("║          KX Език за програмиране          ║\n");
    printf("║         Версия 1.0 (Български)            ║\n");
    printf("╚═══════════════════════════════════════════╝\n");
    printf("\n");
    printf("Команди:\n");
    printf("  :изход      - Изход от REPL\n");
    printf("  :помощ      - Покажи тази помощ\n");
    printf("  :среда      - Покажи променливите в средата\n");
    printf("  :ясно       - Изчисти екрана\n");
    printf("  :отчет      - Включи/изключи отчет за грешки\n");
    printf("\n");
    printf("Започнете да пишете код или въведете команда.\n");
    printf("\n");
    
    Interpreter* interpreter = create_interpreter();
    global_interpreter = interpreter;
    
    // Register signal handler
    signal(SIGINT, handle_sigint);
    
    // Register built-in functions
    register_builtins(interpreter);
    
    char* line = NULL;
    size_t len = 0;
    ssize_t read;
    int line_num = 1;
    bool debug_mode = false;
    
    while (1) {
        printf("kx:%03d> ", line_num);
        
        read = getline(&line, &len, stdin);
        if (read == -1) {
            break; // EOF
        }
        
        // Remove newline
        if (line[read - 1] == '\n') {
            line[read - 1] = '\0';
            read--;
        }
        
        // Handle empty input
        if (read == 0) {
            continue;
        }
        
        // Check for commands
        if (line[0] == ':') {
            if (strcmp(line, ":изход") == 0 || strcmp(line, ":exit") == 0) {
                break;
            } else if (strcmp(line, ":помощ") == 0 || strcmp(line, ":help") == 0) {
                printf("Команди на REPL:\n");
                printf("  :изход      - Изход от REPL\n");
                printf("  :помощ      - Покажи тази помощ\n");
                printf("  :среда      - Покажи променливите в средата\n");
                printf("  :ясно       - Изчисти екрана\n");
                printf("  :отчет      - Включи/изключи отчет за грешки\n");
            } else if (strcmp(line, ":среда") == 0 || strcmp(line, ":env") == 0) {
                env_print(interpreter->current_env);
            } else if (strcmp(line, ":ясно") == 0 || strcmp(line, ":clear") == 0) {
                printf("\033[H\033[J"); // Clear screen
            } else if (strcmp(line, ":отчет") == 0 || strcmp(line, ":debug") == 0) {
                debug_mode = !debug_mode;
                interpreter_set_debug(interpreter, debug_mode);
                printf("Режим на отчет: %s\n", debug_mode ? "ВКЛЮЧЕН" : "ИЗКЛЮЧЕН");
            } else {
                printf("Неразпозната команда: %s\n", line);
                printf("Въведете ':помощ' за списък с команди.\n");
            }
            continue;
        }
        
        // Create a temporary file for the input
        FILE* temp = tmpfile();
        if (!temp) {
            fprintf(stderr, "Грешка при създаване на временен файл\n");
            continue;
        }
        
        fputs(line, temp);
        rewind(temp);
        
        // Initialize lexer with temporary file
        void* scanner = kx_lex_init(temp);
        
        ASTNode* ast = NULL;
        
        int parse_result = yyparse(scanner, &ast);
        kx_lex_destroy(scanner);
        fclose(temp);
        
        if (parse_result != 0 || !ast) {
            fprintf(stderr, "Грешка при парсване на реда\n");
            line_num++;
            continue;
        }
        
        // Reset interpreter state
        interpreter->control.has_error = false;
        interpreter->control.has_return = false;
        interpreter->control.should_break = false;
        interpreter->control.should_continue = false;
        
        // Execute
        Value result = interpret(interpreter, ast);
        
        if (interpreter->control.has_error) {
            fprintf(stderr, "Грешка: %s\n", interpreter->control.error_message);
        } else if (result.type == VAL_ERROR) {
            char* error_msg = value_to_string(result);
            fprintf(stderr, "Грешка: %s\n", error_msg);
            free(error_msg);
        } else if (result.type != VAL_NULL) {
            char* result_str = value_to_string(result);
            printf("%s\n", result_str);
            free(result_str);
        }
        
        free_value(result);
        free_ast(ast);
        
        line_num++;
    }
    
    if (line) {
        free(line);
    }
    
    free_interpreter(interpreter);
    global_interpreter = NULL;
    
    printf("\nДовиждане! 👋\n");
}

void show_version() {
    printf("KX Език за програмиране v1.0\n");
    printf("Типизиран интерпретируем език с български синтаксис\n");
    printf("Компилирано на %s %s\n", __DATE__, __TIME__);
    printf("\n");
    printf("Поддържани типове:\n");
    printf("  • число (дробно)\n");
    printf("  • низ (UTF-8)\n");
    printf("  • булев (истина/лъжа)\n");
    printf("  • символ (единичен знак)\n");
    printf("  • масив\n");
    printf("  • функция\n");
    printf("\n");
    printf("Синтаксис:\n");
    printf("  променлива име = стойност\n");
    printf("  ако условие тогава ... иначе ... край\n");
    printf("  докато условие тогава ... край\n");
    printf("  за променлива = начало, край, стъпка тогава ... край\n");
    printf("  функция име(параметри) ... върни стойност ... край\n");
    printf("\n");
}

int main(int argc, char** argv) {
    printf("\n");
    
    if (argc == 1) {
        // No arguments, start REPL
        run_repl();
    } else if (argc == 2) {
        if (strcmp(argv[1], "--version") == 0 || strcmp(argv[1], "-v") == 0) {
            show_version();
        } else if (strcmp(argv[1], "--help") == 0 || strcmp(argv[1], "-h") == 0) {
            printf("Употреба: %s [опции] [файл]\n", argv[0]);
            printf("\n");
            printf("Опции:\n");
            printf("  --version, -v    Покажи версията\n");
            printf("  --help, -h       Покажи тази помощ\n");
            printf("  файл.kx          Изпълни файл на KX\n");
            printf("\n");
            printf("Ако не се подаде файл, стартира се интерактивна конзола (REPL).\n");
        } else {
            // Check file extension
            char* ext = strrchr(argv[1], '.');
            if (!ext || strcmp(ext, ".kx") != 0) {
                printf("Предупреждение: Файлът '%s' няма разширение .kx\n", argv[1]);
            }
            run_file(argv[1]);
        }
    } else {
        fprintf(stderr, "Грешка: Твърде много аргументи\n");
        fprintf(stderr, "Употреба: %s [файл.kx]\n", argv[0]);
        return 1;
    }
    
    return 0;
}