import { renderHook } from '@testing-library/react-hooks';
import useClassy, { classier, classy, when } from './classy';

describe( 'classy', () => {
	describe( 'when', () => {
		const props = {
			a: 1,
			b: '2',
			c: true,
			d: [ 1, 2 ],
			e: [ 'foo', 'bar' ],
			f: [ false ],
			g: { foo: 1, bar: 2 },
			h: undefined,
			i: null,
		};

		it( 'calculates single `when` condition correctly', () => {
			expect( when< typeof props >( { a: 1 } )( props ) ).toBe( true );
			expect( when< typeof props >( { a: 0 } )( props ) ).toBe( false );
			expect( when< typeof props >( { a: '1' } )( props ) ).toBe( false );
			expect( when< typeof props >( { a: true } )( props ) ).toBe(
				false
			);

			expect( when< typeof props >( { b: '2' } )( props ) ).toBe( true );
			expect( when< typeof props >( { b: '1' } )( props ) ).toBe( false );
			expect( when< typeof props >( { b: 2 } )( props ) ).toBe( false );
			expect( when< typeof props >( { b: true } )( props ) ).toBe(
				false
			);

			expect( when< typeof props >( { c: true } )( props ) ).toBe( true );
			expect( when< typeof props >( { c: false } )( props ) ).toBe(
				false
			);
			expect( when< typeof props >( { c: 1 } )( props ) ).toBe( false );
			expect( when< typeof props >( { c: 'true' } )( props ) ).toBe(
				false
			);

			expect( when< typeof props >( { d: [ 1, 2 ] } )( props ) ).toBe(
				true
			);
			expect( when< typeof props >( { d: [ 1 ] } )( props ) ).toBe(
				false
			);
			expect( when< typeof props >( { d: 0 } )( props ) ).toBe( false );
			expect( when< typeof props >( { d: true } )( props ) ).toBe(
				false
			);

			expect(
				when< typeof props >( { e: [ 'foo', 'bar' ] } )( props )
			).toBe( true );
			expect( when< typeof props >( { e: [ 'foo' ] } )( props ) ).toBe(
				false
			);
			expect( when< typeof props >( { e: 0 } )( props ) ).toBe( false );
			expect( when< typeof props >( { e: true } )( props ) ).toBe(
				false
			);

			expect( when< typeof props >( { f: [ false ] } )( props ) ).toBe(
				true
			);
			expect( when< typeof props >( { f: [ 'foo' ] } )( props ) ).toBe(
				false
			);
			expect( when< typeof props >( { f: 0 } )( props ) ).toBe( false );
			expect( when< typeof props >( { f: true } )( props ) ).toBe(
				false
			);

			expect(
				when< typeof props >( { g: ( obj ) => obj.foo === 1 } )( props )
			).toBe( true );
			expect( when< typeof props >( { g: 'foo' } )( props ) ).toBe(
				false
			);
			expect( when< typeof props >( { g: 0 } )( props ) ).toBe( false );
			expect( when< typeof props >( { g: true } )( props ) ).toBe(
				false
			);

			expect( when< typeof props >( { h: undefined } )( props ) ).toBe(
				true
			);
			expect( when< typeof props >( { h: null } )( props ) ).toBe(
				false
			);

			expect( when< typeof props >( { i: null } )( props ) ).toBe( true );
			expect( when< typeof props >( { i: undefined } )( props ) ).toBe(
				false
			);
		} );

		it( 'calculates composite `when` condition correctly', () => {
			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( true );

			expect(
				when< typeof props >( {
					a: '1',
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: 2,
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: false,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 0, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'zoo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ true ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 0,
					h: undefined,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: null,
					i: null,
				} )( props )
			).toBe( false );

			expect(
				when< typeof props >( {
					a: 1,
					b: '2',
					c: true,
					d: [ 1, 2 ],
					e: [ 'foo', 'bar' ],
					f: [ false ],
					g: ( obj ) => obj.foo === 1,
					h: undefined,
					i: '',
				} )( props )
			).toBe( false );
		} );
	} );

	describe( 'classy', () => {
		it( 'returns correct classes based on booleans', () => {
			expect(
				classy( {
					'class-a': true,
					'class-b': true,
					'class-c': true,
				} )
			).toBe( 'class-a class-b class-c' );

			expect(
				classy( {
					'class-a': true,
					'class-b': false,
					'class-c': true,
				} )
			).toBe( 'class-a class-c' );

			expect(
				classy( {
					'class-a': true,
					'class-b': true,
					'class-c': false,
				} )
			).toBe( 'class-a class-b' );

			expect(
				classy( {
					'class-a': false,
					'class-b': false,
					'class-c': false,
				} )
			).toBe( '' );
		} );
	} );

	describe( 'classier', () => {
		it( 'returns correct classes based on booleans', () => {
			expect(
				classier( {
					'class-a': true,
					'class-b': true,
					'class-c': true,
				} )( {} )
			).toBe( 'class-a class-b class-c' );

			expect(
				classier( {
					'class-a': true,
					'class-b': false,
					'class-c': true,
				} )( {} )
			).toBe( 'class-a class-c' );

			expect(
				classier( {
					'class-a': true,
					'class-b': true,
					'class-c': false,
				} )( {} )
			).toBe( 'class-a class-b' );

			expect(
				classier( {
					'class-a': false,
					'class-b': false,
					'class-c': false,
				} )( {} )
			).toBe( '' );
		} );

		it( 'returns correct classes based on `when` helper return', () => {
			const props = {
				a: 1,
				b: 2,
				c: '3',
			};

			expect(
				classier( {
					'class-a': when< typeof props >( { a: 1 } ),
					'class-b': when< typeof props >( { b: 2 } ),
					'class-c': when< typeof props >( { c: '3' } ),
				} )( props )
			).toBe( 'class-a class-b class-c' );

			expect(
				classier( {
					'class-a': when< typeof props >( { a: 1 } ),
					'class-b': when< typeof props >( {
						b: ( value ) => value !== 2,
					} ),
					'class-c': when< typeof props >( { c: '3' } ),
				} )( props )
			).toBe( 'class-a class-c' );

			expect(
				classier( {
					'class-a': when< typeof props >( { a: 1 } ),
					'class-b': when< typeof props >( { b: [ 1, 2, 3 ] } ),
					'class-c': when< typeof props >( { c: 'any value' } ),
				} )( props )
			).toBe( 'class-a class-b' );

			expect(
				classier( {
					'class-a': when< typeof props >( { a: false } ),
					'class-b': when< typeof props >( { b: [ 1, 2, 3 ] } ),
					// TODO: figure out how to not need the typeof here
					'class-c': when< typeof props >(
						{ a: 1 },
						{ b: 2 },
						{ c: 'k' }
					),
					'class-d': when< typeof props >( { a: 1 } ),
				} )( props )
			).toBe( 'class-b class-c class-d' );

			expect(
				classier( {
					'class-0': true,
					'class-a': when( { a: false } ),
					'class-b': when( { b: [ 1, 2, 3 ] } ),
					'class-c': when< typeof props >(
						{ a: 1 },
						{ c: 'any value' }
					),
					'class-d': when( { a: 1 } ),
					'class-n': true,
				} )( props )
			).toBe( 'class-0 class-b class-c class-d class-n' );
		} );
	} );

	describe( 'useClassy', () => {
		it( 'returns `when` and `classy` functions correctly', () => {
			const props = {
				a: 1,
				b: 2,
				c: 3,
			};
			const { result } = renderHook( () => useClassy( props ) );

			expect( typeof result.current.when ).toBe( 'function' );
			expect( typeof result.current.classy ).toBe( 'function' );
		} );

		it( 'returns correct classes based on booleans', () => {
			const { result } = renderHook( () => useClassy( {} ) );

			const a = result.current.classy( {
				'class-a': true,
				'class-b': true,
				'class-c': true,
			} );

			expect( a ).toBe( 'class-a class-b class-c' );

			expect(
				result.current.classy( {
					'class-a': true,
					'class-b': false,
					'class-c': true,
				} )
			).toBe( 'class-a class-c' );

			expect(
				result.current.classy( {
					'class-a': true,
					'class-b': true,
					'class-c': false,
				} )
			).toBe( 'class-a class-b' );

			expect(
				result.current.classy( {
					'class-a': false,
					'class-b': false,
					'class-c': false,
				} )
			).toBe( '' );
		} );

		it( 'returns correct classes based on `when` helper return', () => {
			const props = {
				a: 1,
				b: 2,
				c: 3,
			};

			const { result } = renderHook( () => useClassy( props ) );
			const { when, classy } = result.current;

			expect(
				classy( {
					'class-a': when( { a: 1 } ),
					'class-b': when( { b: 2 } ),
					'class-c': when( { c: 3 } ),
				} )
			).toBe( 'class-a class-b class-c' );

			expect(
				classy( {
					'class-a': when( { a: 1 } ),
					'class-b': when( { b: ( value ) => value !== 2 } ),
					'class-c': when( { c: 3 } ),
				} )
			).toBe( 'class-a class-c' );

			expect(
				classy( {
					'class-a': when( { a: 1 } ),
					'class-b': when( { b: [ 1, 2, 3 ] } ),
					'class-c': when( { c: 'any value' } ),
				} )
			).toBe( 'class-a class-b' );

			expect(
				classy( {
					'class-a': when( { a: false } ),
					'class-b': when( { b: [ 1, 2, 3 ] } ),
					'class-c': when( { a: 1 }, { c: 'any value' } ),
					'class-d': when( { a: 1 } ),
				} )
			).toBe( 'class-b class-c class-d' );

			expect(
				classy(
					'class-0',
					{
						'class-a': when( { a: false } ),
						'class-b': when( { b: [ 1, 2, 3 ] } ),
						'class-c': when( { a: 1 }, { c: 'any value' } ),
						'class-d': when( { a: 1 } ),
					},
					'class-n'
				)
			).toBe( 'class-0 class-b class-c class-d class-n' );
		} );
	} );
} );
