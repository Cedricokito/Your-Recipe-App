import { Center, Heading, Input, Text, Grid, Box, Flex, Image } from '@chakra-ui/react';
import { data } from '../utils/data';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const RecipeListPage = () => {
  let [inputValue, setInputValue] = useState("");
  let navigate = useNavigate();

  const isVeganOrVegetarian = (healthLabel) => {
    if (healthLabel.includes('Vegan')) {
      return 'Vegan';
    } else if (healthLabel.includes('Vegetarian')) {
      return 'Vegetarian';
    } else {
      return '';
    }
  }

  function handleSearch(e) {
    let value = e.target.value.toLowerCase();
    setInputValue(value)
  }

  const filteredRecipes = inputValue === "" ? data.hits : data.hits.filter(recipe =>
    (recipe.recipe.label.toLowerCase().includes(inputValue) ||
      isVeganOrVegetarian(recipe.recipe.healthLabels).toLowerCase().includes(inputValue))
  );

  return (
    <Center flexDir="column" bg="rgb(170, 170, 226)" p={8} minH="100vh">
      <Heading>Your Recipe App</Heading>
      <Input
        type='text'
        placeholder='Search recipes'
        onChange={handleSearch}
        w={{ base: "70%", md: "30%" }}
        mt={4}
        mb={8}
        borderRadius="md"
        py={2}
        px={4}
        bg="white"
      />
      <Grid
       templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
        gap={6}
        w="100%"
        maxW="1200px"
        mx="auto"
      >
        {filteredRecipes.map((recipe, index) => (
          <Box
            key={index.toString()}
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            onClick={() => navigate(`/recipepage?recipe=${recipe.recipe.label}`)}
          >
            <Image h="15vh" w="100%" objectFit="cover" src={recipe.recipe.image} alt='' />
            <Box p={4}>
              {recipe.recipe.mealType && (
                recipe.recipe.mealType.map((type, index) => (
                  <Text key={index} textAlign="center" fontWeight="bold" color="#a59e9e">{type}</Text>
                ))
              )}
              <Heading fontSize="1.1rem" textAlign="center" mt={2}>{recipe.recipe.label}</Heading>
              <Text bg="rgb(227, 157, 227)" textTransform="uppercase" borderRadius="sm" pl={1} pr={1} w="fit-content"  m="auto" textAlign="center">{isVeganOrVegetarian(recipe.recipe.healthLabels)}</Text>
              <Flex flexWrap="wrap" mt={2} justifyContent="center">
                {recipe.recipe.dietLabels && (
                  recipe.recipe.dietLabels.map((label, index) => (
                    <Text key={index} bg="rgb(175, 230, 237)" textTransform="uppercase" borderRadius="md" px={2} py={1} fontSize="sm" fontWeight="500" mr={2} mb={2}>{label}</Text>
                  ))
                )}
              </Flex>
              {recipe.recipe.dishType && (
                recipe.recipe.dishType.map((type, index) => (
                  <Text textAlign="center" key={index} mt={2}>Dish: {type}</Text>
                ))
              )}
              {recipe.recipe.cautions && recipe.recipe.cautions.length > 0 && (
                <Heading mt={2} fontSize="1rem" textAlign="center">Cautions</Heading>
              )}
              <Flex flexWrap="wrap" mt={2} justifyContent="center">
                {recipe.recipe.cautions && (
                  recipe.recipe.cautions.map((caution, index) => (
                    <Text key={index} bg="rgb(198, 191, 234)" textTransform="uppercase" borderRadius="md" px={2} py={1} fontSize="sm" mr={2} mb={2}>{caution}</Text>
                  ))
                )}
              </Flex>
            </Box>
          </Box>
        ))}
      </Grid>
    </Center>
  );
};
