// related objects
// Using Reference (Noramalization) - (+)Single place to modify, (-)extra query
let author = {
	name: 'Martin'
}

let course = {
	author: 'id'
}

// using Embedded Documents (Denormalization) (+) Single query, performance (-) Multiple documents to update
let course = {
	author: {
		name: 'Martin'
	}
}

// Hybrid Approach

let author = {
	name: 'Martin'
	// other properties
}

let course = {
	author: {
		id: 'ref',
		name: 'Martin'
	}
}