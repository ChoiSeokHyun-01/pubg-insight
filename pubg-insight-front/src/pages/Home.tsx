import Button from "../components/Button";

export default function Home() {
    return <>
        <Button to={"/map/sanhok"} >to sanhok</Button>
        <Button to="/HealthCheck" replace>Health</Button>
    </>
}


