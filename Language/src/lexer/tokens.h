// src/lexer/tokens.h
#ifndef TOKENS_H
#define TOKENS_H

typedef enum {
    // Keywords (Bulgarian)
    TOK_VAR = 256,        // променлива
    TOK_IF,               // ако
    TOK_ELSE,             // иначе
    TOK_ELSEIF,           // иначе ако
    TOK_WHILE,            // докато
    TOK_FOR,              // за
    TOK_FUNCTION,         // функция
    TOK_RETURN,           // върни
    TOK_THEN,             // тогава
    TOK_END,              // край
    TOK_AND,              // и
    TOK_OR,               // или
    TOK_NOT,              // не
    TOK_TRUE,             // истина
    TOK_FALSE,            // лъжа
    TOK_PRINT,            // печатай
    TOK_READ,             // прочети
    TOK_BREAK,            // прекъсни
    TOK_CONTINUE,         // продължи
    
    // Types
    TOK_NUMBER_TYPE,      // число
    TOK_STRING_TYPE,      // низ
    TOK_BOOL_TYPE,        // булев
    TOK_CHAR_TYPE,        // символ  <- НОВО!
    TOK_NULL,             // нищо
    
    // Operators
    TOK_PLUS,             // +
    TOK_MINUS,            // -
    TOK_MULTIPLY,         // *
    TOK_DIVIDE,           // /
    TOK_MODULO,           // %
    TOK_POWER,            // ^
    TOK_ASSIGN,           // =
    TOK_EQUAL,            // ==
    TOK_NOT_EQUAL,        // !=
    TOK_GREATER,          // >
    TOK_LESS,             // <
    TOK_GREATER_EQUAL,    // >=
    TOK_LESS_EQUAL,       // <=
    TOK_INCREMENT,        // ++
    TOK_DECREMENT,        // --
    
    // Delimiters
    TOK_LPAREN,           // (
    TOK_RPAREN,           // )
    TOK_LBRACE,           // {
    TOK_RBRACE,           // }
    TOK_LBRACKET,         // [
    TOK_RBRACKET,         // ]
    TOK_COMMA,            // ,
    TOK_SEMICOLON,        // ;
    TOK_COLON,            // :
    TOK_DOT,              // .
    TOK_QUESTION,         // ?
    TOK_EXCLAMATION,      // !
    
    // Literals and identifiers
    TOK_IDENTIFIER,
    TOK_NUMBER_LITERAL,
    TOK_STRING_LITERAL,
    TOK_CHAR_LITERAL,     // <- НОВО!
    
    TOK_EOF
} TokenType;

typedef struct {
    TokenType type;
    char* lexeme;
    int line;
    int column;
    union {
        double number_value;
        char* string_value;
        char char_value;  // <- НОВО!
    } literal;
} Token;

extern char* token_names[];

#endif