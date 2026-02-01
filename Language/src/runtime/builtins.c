// src/runtime/builtins.c
#include "builtins.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
#include <time.h>

Value builtin_print(Value* args, int arg_count) {
    for (int i = 0; i < arg_count; i++) {
        char* str = value_to_string(args[i]);
        printf("%s", str);
        free(str);
        
        if (i < arg_count - 1) {
            printf(" ");
        }
    }
    printf("\n");
    return null_val();
}

Value builtin_read(Value* args, int arg_count) {
    if (arg_count > 0) {
        if (args[0].type != VAL_STRING) {
            return error_val("Функцията 'прочети' очаква низ за подкана");
        }
        printf("%s", args[0].as.string);
    }
    
    char buffer[1024];
    if (fgets(buffer, sizeof(buffer), stdin)) {
        // Remove newline
        buffer[strcspn(buffer, "\n")] = 0;
        return string_val(buffer);
    }
    return string_val("");
}

Value builtin_length(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'дължина' очаква 1 аргумент");
    }
    
    Value arg = args[0];
    if (arg.type == VAL_STRING) {
        return number_val(strlen(arg.as.string));
    } else if (arg.type == VAL_ARRAY) {
        return number_val(arg.as.array->count);
    } else {
        return error_val("Функцията 'дължина' се прилага само за низове и масиви");
    }
}

Value builtin_type(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'тип' очаква 1 аргумент");
    }
    
    switch (args[0].type) {
        case VAL_NUMBER: return string_val("число");
        case VAL_STRING: return string_val("низ");
        case VAL_BOOL: return string_val("булев");
        case VAL_CHAR: return string_val("символ");
        case VAL_FUNCTION: return string_val("функция");
        case VAL_NULL: return string_val("нищо");
        case VAL_ARRAY: return string_val("масив");
        case VAL_ERROR: return string_val("грешка");
        default: return string_val("неизвестен");
    }
}

Value builtin_to_number(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'към_число' очаква 1 аргумент");
    }
    
    Value arg = args[0];
    switch (arg.type) {
        case VAL_NUMBER:
            return copy_value(arg);
        case VAL_STRING: {
            char* end;
            double num = strtod(arg.as.string, &end);
            if (end != arg.as.string) {
                return number_val(num);
            }
            break;
        }
        case VAL_BOOL:
            return number_val(arg.as.boolean ? 1.0 : 0.0);
        case VAL_CHAR:
            return number_val((double)arg.as.character);
        default:
            break;
    }
    
    return error_val("Не може да се преобразува към число");
}

Value builtin_to_string(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'към_низ' очаква 1 аргумент");
    }
    
    return string_val(value_to_string(args[0]));
}

Value builtin_sqrt(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'корен' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    double num = args[0].as.number;
    if (num < 0) {
        return error_val("Корен от отрицателно число");
    }
    
    return number_val(sqrt(num));
}

Value builtin_pow(Value* args, int arg_count) {
    if (arg_count != 2) {
        return error_val("Функцията 'степен' очаква 2 аргумента");
    }
    
    if (args[0].type != VAL_NUMBER || args[1].type != VAL_NUMBER) {
        return error_val("Аргументите трябва да са числа");
    }
    
    return number_val(pow(args[0].as.number, args[1].as.number));
}

Value builtin_sin(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'синус' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    return number_val(sin(args[0].as.number));
}

Value builtin_cos(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'косинус' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    return number_val(cos(args[0].as.number));
}

Value builtin_abs(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'абсолютна' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    return number_val(fabs(args[0].as.number));
}

Value builtin_floor(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'закръгли_надолу' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    return number_val(floor(args[0].as.number));
}

Value builtin_ceil(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'закръгли_нагоре' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    return number_val(ceil(args[0].as.number));
}

Value builtin_round(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'закръгли' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_NUMBER) {
        return error_val("Аргументът трябва да бъде число");
    }
    
    return number_val(round(args[0].as.number));
}

Value builtin_random(Value* args, int arg_count) {
    static int seeded = 0;
    if (!seeded) {
        srand(time(NULL));
        seeded = 1;
    }
    
    if (arg_count == 0) {
        // Return random number between 0 and 1
        return number_val((double)rand() / RAND_MAX);
    } else if (arg_count == 1) {
        // Return random integer between 0 and n-1
        if (args[0].type != VAL_NUMBER) {
            return error_val("Аргументът трябва да бъде число");
        }
        int max = (int)args[0].as.number;
        if (max <= 0) {
            return error_val("Аргументът трябва да бъде положителен");
        }
        return number_val(rand() % max);
    } else if (arg_count == 2) {
        // Return random number between min and max
        if (args[0].type != VAL_NUMBER || args[1].type != VAL_NUMBER) {
            return error_val("Аргументите трябва да са числа");
        }
        double min = args[0].as.number;
        double max = args[1].as.number;
        if (min >= max) {
            return error_val("Минимумът трябва да бъде по-малък от максимума");
        }
        return number_val(min + ((double)rand() / RAND_MAX) * (max - min));
    } else {
        return error_val("Функцията 'случайно' очаква 0, 1 или 2 аргумента");
    }
}

Value builtin_time(Value* args, int arg_count) {
    if (arg_count != 0) {
        return error_val("Функцията 'време' не очаква аргументи");
    }
    
    return number_val((double)time(NULL));
}

Value builtin_split(Value* args, int arg_count) {
    if (arg_count != 2) {
        return error_val("Функцията 'раздели' очаква 2 аргумента");
    }
    
    if (args[0].type != VAL_STRING || args[1].type != VAL_STRING) {
        return error_val("Аргументите трябва да са низове");
    }
    
    char* str = args[0].as.string;
    char* delimiter = args[1].as.string;
    
    Array* array = create_array();
    
    if (strlen(delimiter) == 0) {
        // Split by characters
        for (int i = 0; str[i]; i++) {
            char ch[2] = {str[i], '\0'};
            array_append(array, string_val(ch));
        }
    } else {
        // Split by delimiter
        char* copy = strdup(str);
        char* token = strtok(copy, delimiter);
        
        while (token != NULL) {
            array_append(array, string_val(token));
            token = strtok(NULL, delimiter);
        }
        
        free(copy);
    }
    
    return array_val(array);
}

Value builtin_join(Value* args, int arg_count) {
    if (arg_count != 2) {
        return error_val("Функцията 'съедини' очаква 2 аргумента");
    }
    
    if (args[0].type != VAL_ARRAY || args[1].type != VAL_STRING) {
        return error_val("Първият аргумент трябва да е масив, вторият - низ");
    }
    
    Array* array = args[0].as.array;
    char* delimiter = args[1].as.string;
    
    if (array->count == 0) {
        return string_val("");
    }
    
    // Calculate total length
    size_t total_len = 0;
    char** strings = malloc(sizeof(char*) * array->count);
    
    for (int i = 0; i < array->count; i++) {
        strings[i] = value_to_string(array->values[i]);
        total_len += strlen(strings[i]);
    }
    
    total_len += (array->count - 1) * strlen(delimiter) + 1;
    
    // Build result
    char* result = malloc(total_len);
    result[0] = '\0';
    
    for (int i = 0; i < array->count; i++) {
        strcat(result, strings[i]);
        if (i < array->count - 1) {
            strcat(result, delimiter);
        }
        free(strings[i]);
    }
    
    free(strings);
    Value val = string_val(result);
    free(result);
    return val;
}

Value builtin_trim(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'изрежи' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_STRING) {
        return error_val("Аргументът трябва да бъде низ");
    }
    
    char* str = args[0].as.string;
    char* start = str;
    char* end = str + strlen(str) - 1;
    
    // Trim leading spaces
    while (*start && isspace((unsigned char)*start)) {
        start++;
    }
    
    // Trim trailing spaces
    while (end > start && isspace((unsigned char)*end)) {
        end--;
    }
    
    // Copy trimmed string
    int len = end - start + 1;
    char* trimmed = malloc(len + 1);
    strncpy(trimmed, start, len);
    trimmed[len] = '\0';
    
    Value val = string_val(trimmed);
    free(trimmed);
    return val;
}

Value builtin_upper(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'главни' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_STRING) {
        return error_val("Аргументът трябва да бъде низ");
    }
    
    char* str = args[0].as.string;
    char* upper = strdup(str);
    
    for (int i = 0; upper[i]; i++) {
        upper[i] = toupper((unsigned char)upper[i]);
    }
    
    Value val = string_val(upper);
    free(upper);
    return val;
}

Value builtin_lower(Value* args, int arg_count) {
    if (arg_count != 1) {
        return error_val("Функцията 'малки' очаква 1 аргумент");
    }
    
    if (args[0].type != VAL_STRING) {
        return error_val("Аргументът трябва да бъде низ");
    }
    
    char* str = args[0].as.string;
    char* lower = strdup(str);
    
    for (int i = 0; lower[i]; i++) {
        lower[i] = tolower((unsigned char)lower[i]);
    }
    
    Value val = string_val(lower);
    free(lower);
    return val;
}