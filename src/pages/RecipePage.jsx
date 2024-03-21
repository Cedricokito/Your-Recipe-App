import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { data } from "../utils/data";
import { Center, Heading, Text, Box, Image, Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const RecipePage = () => {
  const location = useLocation();
  const [recipe, setRecipe] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const recipeLabel = params.get("recipe");
    const matchedRecipe = data.hits.find((recipe) => recipe.recipe.label === recipeLabel);
    setRecipe(matchedRecipe);
  }, [location.search]);

  // Function to get quantity and unit of specific nutrients
  const getNutrientInfo = (nutrientLabel) => {
    if (!recipe) return null;

    const nutrient = recipe.recipe.totalNutrients[nutrientLabel];
    if (nutrient) {
      return {
        quantity: nutrient.quantity.toFixed(),
        unit: nutrient.unit
      };
    } else {
      return null;
    }
  };

  return (
    <>
      <Center bg="rgb(170, 170, 226)" minH="100vh">
        <Box>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            position="absolute"
            top="1%"
            left="1%"
            zIndex="1"
          />
           <Center>
          {recipe ? (
            <Box bg="white" p={4} borderRadius="md" boxShadow="md" w={{ base: "100%", md: "80%" }}>
              <Image src={recipe.recipe.image} alt="" h="40vh" w="100%" objectFit="cover" borderRadius="md" />
              <Flex mt={4} flexWrap={{ base: "wrap", md: "wrap" }}>
                <Box flex="1">
                  {recipe.recipe.mealType?.map((type, index) => (
                    <Text key={index} fontWeight="bold" color="#a59e9e">
                      {type}
                    </Text>
                  ))}
                  <Heading>{recipe.recipe.label}</Heading>
                  <Box>
                    <Text>Total Cooking Time: {recipe.recipe.totalTime} minutes</Text>
                    <Text>Servings: {recipe.recipe.yield}</Text>
                  </Box>
                  <Text textTransform="capitalize">Dish: {recipe.recipe.dishType?.join(", ")}</Text>
                  <Heading fontSize="1.2rem" mt={2}>
                    Ingredients:
                  </Heading>
                  {recipe.recipe.ingredientLines.map((ingredient, index) => (
                    <Text key={index}>{ingredient.startsWith("*") ? ingredient.slice(1) : ingredient}</Text>
                  ))}
                </Box>
                <Box flex="1">
                  <Heading fontSize="1.2rem" mb={2}>
                    Health labels
                  </Heading>
                  <Flex flexWrap="wrap" mb={4}>
                    {recipe.recipe.healthLabels.map((labels, index) => (
                      <Text key={index} textTransform="uppercase" bg="rgb(227, 157, 227)" borderRadius="md" px={2} py={1} fontSize="1rem" fontWeight="500" mr={2} mb={2}>
                        {labels}
                      </Text>
                    ))}
                  </Flex>
                  {recipe.recipe.dietLabels && recipe.recipe.dietLabels.length > 0 && (
                    <Heading fontSize="1.2rem" mb={2}>
                    Diet:
                  </Heading>
              )}
                 
                  <Flex flexWrap="wrap" mb={4}>
                    {recipe.recipe.dietLabels.map((labels, index) => (
                      <Text key={index} textTransform="uppercase" bg="rgb(157, 227, 219)" borderRadius="md" px={2} py={1} fontSize="1rem" fontWeight="500" mr={2} mb={2}>
                        {labels}
                      </Text>
                    ))}
                  </Flex>
                  {recipe.recipe.cautions && recipe.recipe.cautions.length > 0 && (
                    <Heading fontSize="1.2rem" mb={2}>
                    Cautions:
                  </Heading>
              )}
                 
                  <Flex flexWrap="wrap" mb={4}>
                    {recipe.recipe.cautions.map((caution, index) => (
                      <Text key={index} textTransform="uppercase" bg="rgb(151, 204, 227)" borderRadius="md" px={2} py={1} fontSize="1rem" mr={2} mb={2}>
                        {caution}
                      </Text>
                    ))}
                  </Flex>
                  <Heading fontSize="1.2rem" mb={2}>
                    Total Nutrients:
                  </Heading>
                  <Flex flexWrap="wrap">
                   
                      <Text mr={4} mb={4}>{getNutrientInfo("ENERC_KCAL")?.quantity} {getNutrientInfo("ENERC_KCAL")?.unit} <br /> <span>Calories</span></Text>
                      <Text mr={4} mb={4}>{getNutrientInfo("PROCNT")?.quantity} {getNutrientInfo("PROCNT")?.unit} <br /> <span>Protein</span></Text>
                      <Text mr={4} mb={4}>{getNutrientInfo("FAT")?.quantity} {getNutrientInfo("FAT")?.unit} <br /> <span>Fat</span></Text>
                      <Text mr={4} mb={4}>{getNutrientInfo("CHOCDF")?.quantity} {getNutrientInfo("CHOCDF")?.unit} <br /> <span>Carbs</span></Text>
                      <Text mr={4} mb={4}>{getNutrientInfo("CHOLE")?.quantity} {getNutrientInfo("CHOLE")?.unit} <br /> <span>Cholesterol</span></Text>
                      <Text mr={4} mb={4}>{getNutrientInfo("NA")?.quantity} {getNutrientInfo("NA")?.unit} <br /> <span>Sodium</span></Text>
                 
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ) : (
            <Text>Recipe Not Found!</Text>
          )}
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default RecipePage;
