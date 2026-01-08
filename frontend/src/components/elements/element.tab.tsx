import { Div } from 'components/base';
import React, { useState, useEffect, ReactNode } from 'react';
import styled from 'styled-components';

// Styled Components
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TabItem = styled(Div)<{ selected?: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  transition: color 0.3s, border-bottom 0.3s;
`;

TabItem.defaultProps = {
    color: "color_1",
    flexDirection: "column",
    alignItems: "center"
  };
  


 const TabBottomLine = styled(Div)``;
 TabBottomLine.defaultProps = {
    background: "linear-gradient(-90deg, rgba(121, 92, 40, 0) 0%, #795C28 21.9%, #C9AA6D 51.4%, #795C28 82.4%, rgba(121, 92, 40, 0) 100%)",
    maxHeight: "2px",
    minHeight: "2px",
    width: "75px",
  };

// TypeScript Interfaces
interface TabProps {
  children: ReactNode;
  onTabSelected?: (index: number) => void;
}

interface TabItemProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode; // Include children here
}

// Tab Component
const Tab: React.FC<TabProps> = ({ children, onTabSelected }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    if (onTabSelected) {
      onTabSelected(selectedTabIndex);
    }
  }, [selectedTabIndex, onTabSelected]);

  return (
    <>
      <TabContainer>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === TabItemComponent) {
            return React.cloneElement(child, {
              onClick: () => setSelectedTabIndex(index),
              selected: selectedTabIndex === index,
            } as TabItemProps);
          }
          return null;
        })}
      </TabContainer>
      {React.Children.map(children, (child, index) =>
        selectedTabIndex === index && React.isValidElement(child) ? child.props.children : null
      )}
    </>
  );
};

// TabItem Component
const TabItemComponent: React.FC<TabItemProps> = ({ label, selected, onClick, children }) => (
  <TabItem selected={selected} onClick={onClick}>
    {label}
    {selected && <TabBottomLine/>}
  </TabItem>
);

export { Tab, TabItemComponent as TabItem };
