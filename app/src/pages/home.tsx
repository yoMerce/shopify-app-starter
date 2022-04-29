import { Card, EmptyState } from "@shopify/polaris";

function Home() {
  return (
    <Card sectioned>
      <EmptyState
        heading="Manage your App"
        action={{ content: "Create an App" }}
        secondaryAction={{ content: "Learn more", url: "https://yomerce.com" }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>This is a shopify-app-starter by yomerce</p>
      </EmptyState>
    </Card>
  );
}

export default Home;
