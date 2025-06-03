import { Tabs } from "radix-ui";
import styles from "./Tabs.module.css";
import { ReactNode } from "react";

type TabItem = {
  label: string;
  value: string;
  content: ReactNode;
};

type Props = {
  tabs: TabItem[];
};

const TabsDemo = ({ tabs }: Props) => (
  <Tabs.Root className={styles.Root} defaultValue={tabs[0].value}>
    <Tabs.List className={styles.List} aria-label="Manage your account">
      {tabs?.map((tab) => (
        <Tabs.Trigger
          key={tab.value}
          className={styles.Trigger}
          value={tab.value}
        >
          {tab.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>

    {tabs.map((tab) => (
      <Tabs.Content
        key={tab.value}
        className={styles.Content}
        value={tab.value}
      >
        {tab.content}
      </Tabs.Content>
    ))}
  </Tabs.Root>
);

export default TabsDemo;
