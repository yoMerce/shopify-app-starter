import { Card, EmptyState } from "@shopify/polaris";

function Settings() {
  return (
    <Card sectioned>
      <EmptyState
        heading="Manage your App"
        action={{ content: "Create an App" }}
        secondaryAction={{ content: "Learn more", url: "https://yomerce.com" }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p className="tw-text-xl">This is a settings page</p>
      </EmptyState>
    </Card>
  );
}

export default Settings;
