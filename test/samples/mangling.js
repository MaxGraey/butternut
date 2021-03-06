module.exports = [
	{
		description: 'does not mangle top-level variables',
		input: `var longname;console.log(longname)`,
		output: `var longname;console.log(longname)`
	},

	{
		description: 'mangles variables declared in function',
		input: `fn=function(){var longname;console.log(longname)}`,
		output: `fn=function(){var a;console.log(a)}`
	},

	{
		description: 'mangles function parameters',
		input: `fn=function(longname){console.log(longname)}`,
		output: `fn=function(a){console.log(a)}`
	},

	{
		description: 'reuses short names',
		input: `
			function foo ( first ) {
				console.log( first );
				return function ( second ) {
					console.log( second );
				};
			}

			function bar ( third ) {
				console.log( third );
			}

			foo();
			bar();`,
		output: `function foo(a){console.log(a);return function(a){console.log(a)}}function bar(a){console.log(a)}foo();bar()`
	},

	{
		description: 'mangled names do not shadow each other',
		input: `
			function foo ( first ) {
				return function ( second ) {
					return first + second;
				};
			}
			foo()`,
		output: `function foo(a){return function(b){return a+b}}foo()`
	},

	{
		description: 'function expression IDs are mangled',
		input: `
			function foo () {
				return function baz (x) {
					if (x > 0) baz(x - 1);
				}
			}
			foo()`,
		output: `function foo(){return function a(b){b>0&&a(b-1)}}foo()`
	},

	{
		description: 'function names are mangled in call expressions',
		input: `
			(function () {
				function foo () {
					bar();
				}

				function bar() {}

				foo();
			}());`,
		output: `!function(){function a(){b()}function b(){}a()}()`
	},

	{
		description: 'mangles catch clause argument',
		input: `
			try {
				foo();
			} catch ( err ) {
				console.error( err )
			}`,
		output: `try{foo()}catch(a){console.error(a)}`
	},

	{
		description: 'mangles function IDs consistently',
		input: `
			(function () {
				function Foo () {}
				function bar ( bar ) {}
				Foo.prototype.bar = bar;
			}());`,
		output: `!function(){function a(){}function b(a){}a.prototype.bar=b}()`
	},

	{
		description: 'does not mangle top-level function IDs',
		input: `
			function Foo () {}
			function bar ( bar ) {}
			Foo.prototype.bar = bar;`,
		output: `function Foo(){}function bar(a){}Foo.prototype.bar=bar`
	},

	{
		description: 'disregards unused vars for mangling',
		input: `
			function foo () {
				var bar = 1;
				var baz = 2;
				var bop = 3;

				console.log( bop );
			}`,
		output: `function foo(){var a=3;console.log(a)}`
	}
];
