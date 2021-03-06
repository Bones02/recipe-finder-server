const express = require( 'express' )
const path = require( 'path' )
const RecipeService = require( './recipe-service' )

const recipeRouter = express.Router()
const jsonParser = express.json()

recipeRouter

  .route( '/' )
  .get( ( req, res, next ) => {
    const knexInstance = req.app.get( 'db' )
    RecipeService.getAllRecipes( knexInstance )
      .then( ( recipes ) => {
        res
          .status( 200 )
          .json( recipes )
      } )
      .catch( next )
  } )
  .post( jsonParser, ( req, res, next ) => {
    console.log("Received post recipe request");
    const { id, title, servings, readyInMinutes, image } = req.body
    if ( !( title && id ) ) {
      return res.status( 400 ).json( {
        error : { message : `${title}, ${id}` }
      } )
    }
    const newRecipe = {
        id, 
        title, 
        servings, 
        readyinminutes: readyInMinutes, 
        image
    }
    RecipeService.insertRecipe(
      req.app.get( 'db' ),
      newRecipe
    )
      .then( ( recipe ) => {
        console.log("Recipe inserted, returning success");
        res
          .status( 201 )
          .location( path.posix.join( req.originalUrl, `/${recipe.id}` ) )
          .json( recipe )
      } )
      .catch( next )
  } )

recipeRouter
  .route( '/:recipeId' )
  .all( ( req, res, next ) => {
    RecipeService.getRecipesById(
      req.app.get( 'db' ),
      req.params.recipeId
    )
      .then( ( recipe ) => {
        if ( !recipe ) {
          return res.status( 404 ).json( {
            error : { message : 'Recipe not found.' }
          } )
        }
        res.recipe = recipe
        next()
      } )
      .catch( next )
  } )
  .get( ( req, res, next ) => {
    res.json( res.recipe )
  } )
  .patch( jsonParser, ( req, res, next ) => {
    const { id, title, servings, readyInMinutes, image} = req.body
    const recipeToUpdate = { id, title, servings, readyInMinutes, image }
    const numberOfUpdatedFields = Object.values( recipeToUpdate ).filter( Boolean ).length
    if ( numberOfUpdatedFields === 0 ) {
      return res.status( 400 ).json( {
        error : {
          message : 'Request body must contain at least one field to update'
        }
      } )
    }
    const newRecipeFields = {
      ...recipeToUpdate, 
      modified
    }
    RecipeService.updateRecipe(
      req.app.get( 'db' ),
      res.recipe.id,
      newRecipeFields
    )
      .then( ( updatedRecipe) => {
        res
          .status( 200 )
          .json( updatedRecipe[0] )
      } )
      .catch( next )
  } )
  .delete( ( req, res, next ) => {
    RecipeService.deleteRecipe(
      req.app.get( 'db' ),
      req.params.recipeId
    )
      .then( ( numRowsAffected ) => {
        res
          .status( 204 )
          .end()
      } )
      .catch( next )
  } )
    
module.exports = recipeRouter