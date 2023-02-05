use rsc::eval;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(arithmetic: &str) -> String {
    match eval::<f64>(arithmetic) {
        Ok(result) => result.floor().to_string(),
        Err(e) => format!("{e:?}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = calculate("10-5");
        assert_eq!(result, "5");
    }
}
