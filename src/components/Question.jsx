import { React, useState, useEffect } from "react";
import uuid from "react-uuid";
import arrayShuffle from "array-shuffle";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  ButtonGroup,
  Box,
  Center,
} from "@chakra-ui/react";

const Question = () => {
  const [questions, setQuestions] = useState();
  const [showAnswer, setShowAnswer] = useState(false);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    api();
  }, []);

  useEffect(() => {
    if (questions) shuffleQuestions();
  }, [questions]);

  const api = async () => {
    const request = await fetch(
      "https://the-trivia-api.com/api/questions?limit=50&region=AR&difficulty=medium"
    );
    const data = await request.json();
    setQuestions(data);
    console.log(data);
  };

  const shuffleQuestions = () => {
    // Hacer destructuring
    // Uso este index porque el index del state es asincronico
    const newIndex = index + 1;
    const incorrectAnswers = questions[newIndex].incorrectAnswers;
    const correctAnswer = questions[newIndex].correctAnswer;
    const allAnswers = incorrectAnswers.concat(correctAnswer);
    const shuffled = arrayShuffle(allAnswers);
    // Respuestas shuffleadas, uso este state porque "questions" tiene data de fetch
    setResponses(shuffled);
    setIndex(newIndex);
  };

  const checkCorrect = (item) => item === questions[index].correctAnswer;

  const checkAnswer = (item) => {
    setShowAnswer(true);
    setTimeout(() => {
      setKeyCounter((prevKey) => prevKey + 1);
      setShowAnswer(false);
      shuffleQuestions();
    }, 1000);
    sumarCorrect(item);
  };

  const checkColor = (item) => {
    if (showAnswer) {
      return checkCorrect(item) ? "whatsapp" : "red";
    } else {
      return "purple";
    }
  };

  // Si no lo pongo aca, donde podria haber puesto el "setCorrect(correct + 1)"?
  const sumarCorrect = (item) => {
    if (checkCorrect(item)) {
      setCorrect(correct + 1);
    }
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setShowAnswer(true);
      setTimeout(() => {
        setKeyCounter((prevKey) => prevKey + 1);
        setShowAnswer(false);
        shuffleQuestions();
      }, 3000);
    }
    return (
      // Ver bien cuando una funcion devuelve un HTML
      <div className="timer">
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  return (
    <div className="question">
      <Text m={5} fontSize="xl">
        Respuestas correctas {correct}
      </Text>
      <Center mt={5}>
        <Heading size="md">{questions && questions[index].question}</Heading>
      </Center>
      <Center m={5}>
        <Text>{questions && questions[index].category}</Text>
      </Center>
      <Center>
        <Box>
          <Grid
            boxShadow="lg"
            p="6"
            rounded="md"
            bg="white"
            gap={3}
            templateColumns="repeat(1, 4fr)"
          >
            {questions &&
              responses.map((item) => {
                return (
                  <GridItem className="btnAnswer" key={uuid()} w="100%" h="10">
                    <ButtonGroup
                      colorScheme={checkColor(item)}
                      variant={showAnswer ? "solid" : "outline"}
                      spacing="6"
                    >
                      <Button onClick={() => checkAnswer(item)}>{item}</Button>
                    </ButtonGroup>
                  </GridItem>
                );
              })}
          </Grid>
        </Box>
      </Center>
      <Center m={10}>
        <CountdownCircleTimer
          key={keyCounter}
          isPlaying
          duration={20}
          colors={["purple"]}
          onComplete={() => [true, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
      </Center>
    </div>
  );
};

export default Question;
