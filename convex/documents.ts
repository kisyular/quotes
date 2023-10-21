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
