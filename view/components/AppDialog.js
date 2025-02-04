import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const AppDialog = ({ visible, onDismiss, ingredient }) => {
  return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>{ingredient?.name}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{ingredient?.description}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismiss}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
  );
};

export default AppDialog;
