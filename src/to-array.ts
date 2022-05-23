export default function toArray< T >( value ): T[] {
	if ( value == null ) {
		return [];
	}

	if ( Array.isArray( value ) ) {
		return value;
	}

	return [ value ];
}
