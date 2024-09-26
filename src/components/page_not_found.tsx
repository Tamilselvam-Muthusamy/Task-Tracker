import {
  Button,
  Container,
  createStyles,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,
    marginTop: 50,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
}));

export default function NotFoundPage() {
  const { classes } = useStyles();

  return (
    <div className="min-h-screen justify-center items-center bg-white">
      <Container className="flex flex-col ">
        <Title className={classes.title}>
          You didn't break the internet, but we can't find what you are looking
          for.
        </Title>
        <img
          className="ml-32"
          alt="logo"
          src="notfound.svg"
          height={350}
          width={650}
        ></img>
        <Text color="dimmed" align="center" className={classes.description}>
          Unfortunately, You mistyped the address.
        </Text>
        <Group position="center">
          <Link to="/">
            <Button variant="light" color="sky" size="md">
              Back to home page
            </Button>
          </Link>
        </Group>
      </Container>
    </div>
  );
}
