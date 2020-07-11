const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255
	},
	category: {
		type: String,
		required: true,
		enum: ['web', 'mobile', 'network'],
		lowercase: true,
		trim: true
	},

	// Build in validaters
	author: String,
	tags: {							// Custom validaters
		type: Array,
		validate: {
			isAsync: true,
			validator: function (v, callback) {		// Async validater
				// Do some async work
				setTimeout(() => {
					const result = v && v.length > 0;
					callback(result);
				},1000);
			},
			message: 'A course should have at least one tag.'
		}
	},
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
	price: {
		type: Number,
		required: function () { return this.isPublished; },  // Cannot replace with arrow funtion
		min: 10,
		max: 5000,
		get: v => Math.round(v),				// round-off amounts
		set: v => Math.round(v)
	}
});

// Create a model( Class)
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {


	// Create Object
	const course = new Course({
		name: 'Angular Course',
		category: 'web',
		author: 'Michael',
		tags: ['angualar', 'frontend'],
		isPublished: true,
		price: 20.00
	});

	// Save to DB
	try {
		//await course.validate();				// Have two options, this one return void
		const result = await course.save();
		console.log(result);
	}
	catch (ex) {
		for (field in ex.errors)				// More than one validation error
			console.log(ex.errors[field].message);
	}
}

async function getCourses() {

	const courses = await Course
		.find({ author: 'Michael', isPublished: true }) // Set filters
		.limit(10)
		.sort({ name: 1 })
		.select({ name: 1, tags: 1, price: 1 });
	console.log(courses);
}

getCourses();

//createCourse();
	// Comparison operators - eq( equal), ne(not equal), gt(greater than), gte(greater than or equal to)
	// lt( less than), lte(less than or equal to), in, nin(not in)

/*	const courses = await Course
		.find({ price: { $gt: 10, $lte: 20 } }) 
		//.find({ price: { $in: [10, 15, 20]} }) 
		.limit(10)
		.sort({ name: 1 })
		.select({name: 1, tags: 1}); 
	console.log(courses);*/


	// Logical Operators
	/*const courses = await Course
		.find()
		.or([{ author: 'Michael' }, { isPublished: true }])
		.and([])
		.limit(10)
		.sort({ name: 1 })
		.select({name: 1, tags: 1}); 
	console.log(courses);*/


	// Pagination - skipping pages

