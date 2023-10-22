import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

// Define a query for getting the sidebar
export const getSidebar = query({
	// Define the arguments for the query
	args: {
		parentDocument: v.optional(v.id('documents')), // The ID of the parent document (if any)
	},
	// Define the handler for the query
	handler: async (ctx, args) => {
		// Get the identity of the current user
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the ID of the current user
		const userId = identity.subject

		// Query the documents in the database
		// with the index 'by_user_parent'
		// where 'userId' equals the current user's ID
		// and 'parentDocument' equals the ID of the parent document (if any)
		// Filter the documents where 'isArchived' is false
		// Order the documents in descending order
		// Collect the documents into an array
		const documents = await ctx.db
			.query('documents')
			.withIndex('by_user_parent', (q) =>
				q.eq('userId', userId).eq('parentDocument', args.parentDocument)
			)
			.filter((q) => q.eq(q.field('isArchived'), false))
			.order('desc')
			.collect()

		// Return the documents
		return documents
	},
})

// Define a mutation for creating a new document
export const create = mutation({
	// Define the arguments for the mutation
	args: {
		title: v.string(), // The title of the document
		parentDocument: v.optional(v.id('documents')), // The ID of the parent document (if any)
	},
	// Define the handler for the mutation
	handler: async (ctx, args) => {
		// Get the identity of the current user
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the ID of the current user
		const userId = identity.subject

		// Insert a new document into the database
		const document = await ctx.db.insert('documents', {
			title: args.title, // The title of the document
			parentDocument: args.parentDocument, // The ID of the parent document (if any)
			userId, // The ID of the current user
			isArchived: false, // The document is not archived
			isPublished: false, // The document is not published
		})

		// Return the newly created document
		return document
	},
})

// Define a mutation for archiving a document
export const archive = mutation({
	// Define the arguments for the mutation
	args: { id: v.id('documents') }, // The ID of the document to be archived
	// Define the handler for the mutation
	handler: async (ctx, args) => {
		// Get the identity of the current user
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the ID of the current user
		const userId = identity.subject

		// Get the existing document from the database
		const existingDocument = await ctx.db.get(args.id)

		// If the document does not exist, throw an error
		if (!existingDocument) {
			throw new Error('Not found')
		}

		// If the user is not the owner of the document, throw an error
		if (existingDocument.userId !== userId) {
			throw new Error('Unauthorized')
		}

		// Define a recursive function to archive a document and its children
		const recursiveArchive = async (documentId: Id<'documents'>) => {
			// Get the children of the document
			const children = await ctx.db
				.query('documents')
				.withIndex('by_user_parent', (q) =>
					q.eq('userId', userId).eq('parentDocument', documentId)
				)
				.collect()

			// For each child, archive it and its children
			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: true, // Set the isArchived field to true
				})

				// Recursively archive the child and its children
				await recursiveArchive(child._id)
			}
		}

		// Archive the document
		const document = await ctx.db.patch(args.id, {
			isArchived: true, // Set the isArchived field to true
		})

		// Recursively archive the document and its children
		recursiveArchive(args.id)

		// Return the archived document
		return document
	},
})

// Export a query to get all the archived documents for a user
export const getTrash = query({
	// The handler function for the query
	handler: async (ctx) => {
		// Get the identity of the current user
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the ID of the current user
		const userId = identity.subject

		// Query the database for documents that belong to the current user
		// and are archived (isArchived is true)
		const documents = await ctx.db
			.query('documents')
			.withIndex('by_user', (q) => q.eq('userId', userId)) // Filter by user ID
			.filter((q) => q.eq(q.field('isArchived'), true)) // Filter by isArchived field
			.order('desc') // Order the results in descending order
			.collect() // Collect the results into an array

		// Return the array of archived documents
		return documents
	},
})

// Export a mutation to restore an archived document
export const restore = mutation({
	// Define the arguments for the mutation
	args: { id: v.id('documents') },
	// Define the handler function for the mutation
	handler: async (ctx, args) => {
		// Get the identity of the current user
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the ID of the current user
		const userId = identity.subject

		// Get the existing document from the database
		const existingDocument = await ctx.db.get(args.id)

		// If the document does not exist, throw an error
		if (!existingDocument) {
			throw new Error('Not found')
		}

		// If the document does not belong to the current user, throw an error
		if (existingDocument.userId !== userId) {
			throw new Error('Unauthorized')
		}

		// Define a recursive function to restore a document and its children
		const recursiveRestore = async (documentId: Id<'documents'>) => {
			// Get the children of the document from the database
			const children = await ctx.db
				.query('documents')
				.withIndex('by_user_parent', (q) =>
					q.eq('userId', userId).eq('parentDocument', documentId)
				)
				.collect()

			// For each child, restore it and its children
			for (const child of children) {
				// Restore the child
				await ctx.db.patch(child._id, {
					isArchived: false, // Set the isArchived field to false
				})

				// Recursively restore the child and its children
				await recursiveRestore(child._id)
			}
		}

		// Define the options for the patch operation
		const options: Partial<Doc<'documents'>> = {
			isArchived: false, // Set the isArchived field to false
		}

		// If the document has a parent, check if the parent is archived
		if (existingDocument.parentDocument) {
			// Get the parent document from the database
			const parent = await ctx.db.get(existingDocument.parentDocument)
			// If the parent is archived, remove the parentDocument field from the options
			if (parent?.isArchived) {
				options.parentDocument = undefined
			}
		}

		// Restore the document
		const document = await ctx.db.patch(args.id, options)

		// Recursively restore the document and its children
		recursiveRestore(args.id)

		// Return the restored document
		return document
	},
})

// Define a mutation for removing a document
export const remove = mutation({
	// Define the arguments for the mutation
	args: { id: v.id('documents') }, // The ID of the document to be removed
	// Define the handler for the mutation
	handler: async (ctx, args) => {
		// Get the user identity
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the user ID from the identity
		const userId = identity.subject

		// Get the existing document from the database
		const existingDocument = await ctx.db.get(args.id)

		// If the document does not exist, throw an error
		if (!existingDocument) {
			throw new Error('Not found')
		}

		// If the user is not the owner of the document, throw an error
		if (existingDocument.userId !== userId) {
			throw new Error('Unauthorized')
		}

		// Delete the document from the database
		const document = await ctx.db.delete(args.id)

		// Return the deleted document
		return document
	},
})

// Define a query for getting search results
export const getSearch = query({
	// Define the handler for the query
	handler: async (ctx) => {
		// Get the user identity
		const identity = await ctx.auth.getUserIdentity()

		// If the user is not authenticated, throw an error
		if (!identity) {
			throw new Error('Not authenticated')
		}

		// Get the user ID from the identity
		const userId = identity.subject

		// Query the documents in the database
		// Filter by user ID and non-archived status
		// Order the results in descending order
		const documents = await ctx.db
			.query('documents')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.filter((q) => q.eq(q.field('isArchived'), false))
			.order('desc')
			.collect()

		// Return the search results
		return documents
	},
})
