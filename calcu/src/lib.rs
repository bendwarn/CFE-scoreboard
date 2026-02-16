use rsc::{parse, tokenize, Interpreter};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(arithmetic: &str) -> String {
    let mut interpreter = Interpreter::default();
    match tokenize(arithmetic) {
        // Step 1: splits input into symbols, words, and numbers
        Ok(tokens) => match parse(&tokens) {
            // Step 2: builds an Expr using tokens
            Ok(expr) => match interpreter.eval(&expr) {
                // Step 3: interprets the Expr
                Ok(result) => result.floor().to_string(),
                Err(interpret_error) => format!("ie {interpret_error:?}"),
            },
            Err(parse_error) => format!("parse_error {parse_error:?}"),
        },
        Err(tokenize_error) => format!("token {tokenize_error:?}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = calculate("7/3");
        assert_eq!(result, "2");
        // assert_eq!("{}", calculate("7 3"));  //ParseError
        // assert_eq!("{}", calculate("sqrt(15, 3)")); //InterpretError
        // assert_eq!("{}", calculate("1.1.1"));  //TokenizeError
    }
}
