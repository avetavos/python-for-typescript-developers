//go:build js && wasm

package main

import (
	"bytes"
	"syscall/js"

	"github.com/traefik/yaegi/interp"
	"github.com/traefik/yaegi/stdlib"
)

func runGo(this js.Value, args []js.Value) interface{} {
	src := args[0].String()
	var out bytes.Buffer
	i := interp.New(interp.Options{Stdout: &out, Stderr: &out})
	if err := i.Use(stdlib.Symbols); err != nil {
		return map[string]interface{}{"output": "", "errors": err.Error()}
	}
	errStr := ""
	if _, err := i.Eval(src); err != nil {
		errStr = err.Error()
	}
	return map[string]interface{}{"output": out.String(), "errors": errStr}
}

func main() {
	js.Global().Set("goRunWasm", js.FuncOf(runGo))
	select {}
}
