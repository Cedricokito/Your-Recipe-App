import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, VStack, Image, Text, useToast, AlertDialog, AlertDialogBody,
  AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Modal, ModalOverlay , ModalContent , ModalHeader , ModalCloseButton , ModalBody ,
  FormControl , FormLabel , Input , Select, ModalFooter, Stack, Checkbox
} from '@chakra-ui/react';

function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  const cancelRef = React.useRef();

  useEffect(() => {
    fetchEvent();
  }, []);

  function formatDate(dateString) {
    if(dateString.length==0)
      return ""
    const date = new Date(dateString);
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  

  const handleCategoryChange = (categoryId) => {
    const isAlreadySelected = editedEvent.categoryIds.includes(categoryId);
    const newCategoryIds = isAlreadySelected ?
      editedEvent.categoryIds.filter(id => id !== categoryId) :
      [...editedEvent.categoryIds, categoryId]; 
    setEditedEvent(prev => ({ ...prev, categoryIds: newCategoryIds }));
  };
  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`);
      const usersResponse = await fetch('http://localhost:3000/users');
      const categoriesResponse = await fetch('http://localhost:3000/categories');
      const eventData = await response.json();
      const categoriesData=await categoriesResponse.json()
      const usersData= await usersResponse.json()
      setEvent(eventData);
      setUsers(usersData);
      setCategories(categoriesData); 
      setEditedEvent(eventData );
 
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editedEvent.title || !editedEvent.description || !editedEvent.image || !editedEvent.startTime || !editedEvent.endTime || !editedEvent.location || !editedEvent.createdBy || !editedEvent.categoryIds.length) {
      toast({
        title: 'Please fill out all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; 
    }
    try {
      await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEvent),
      });
      setIsEditing(false);
      setEvent({ ...editedEvent });
      toast({
        title: 'Event updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      toast({
        title: 'Failed to update event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE',
      });
      toast({
        title: 'Event deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Failed to delete event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} m={5}>
      {event && (
        <>
          <Text fontSize="2xl">{event.title}</Text>
          <Image boxSize="300px" src={event.image} alt={event.title} borderRadius="md" />
          <Text>{event.description}</Text>
          <Text fontWeight="bold">Start Time:</Text> 
<Text>{`${formatDate(event.startTime)}  `}</Text>
<Text fontWeight="bold">End Time:</Text> 
<Text>{formatDate(event.endTime)}</Text>
<Text fontWeight="bold">Categories:</Text>
<Text>{event.categoryIds.map(id => categories.find(cat => cat.id == id)?.name).join(', ')}</Text>
<Text fontWeight="bold">Created By:</Text>
<Text>{users.find(user => user.id == event.createdBy)?.name}</Text>

          {!isEditing && (
            <Button onClick={handleEdit}>Edit</Button>
          )}
          <AlertDialog isOpen={isDeleteAlertOpen} leastDestructiveRef={cancelRef} onClose={() => setIsDeleteAlertOpen(false)}>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Event
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {!isEditing && (
            <Button colorScheme="red" onClick={() => setIsDeleteAlertOpen(true)}>Delete</Button>
          )}
        </>
      )}

<Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit Event</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input value={editedEvent?.title} onChange={e => setEditedEvent(prev => ({ ...prev, title: e.target.value }))} required />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Description</FormLabel>
        <Input value={editedEvent?.description} onChange={e => setEditedEvent(prev => ({ ...prev, description: e.target.value }))} required />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Image URL</FormLabel>
        <Input value={editedEvent?.image} onChange={e => setEditedEvent(prev => ({ ...prev, image: e.target.value }))} required />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Start Time</FormLabel>
        <Input type="datetime-local" value={editedEvent?.startTime ? editedEvent.startTime.slice(0, -5) : ''} onChange={e => setEditedEvent(prev => ({ ...prev, startTime: e.target.value + ':00.000Z' }))} required />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>End Time</FormLabel>
        <Input type="datetime-local" value={editedEvent?.endTime ? editedEvent.endTime.slice(0, -5) : ''} onChange={e => setEditedEvent(prev => ({ ...prev, endTime: e.target.value + ':00.000Z' }))} required />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Location</FormLabel>
        <Input value={editedEvent?.location} onChange={e => setEditedEvent(prev => ({ ...prev, location: e.target.value }))} required />
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Created By</FormLabel>
        <Select value={editedEvent?.createdBy} onChange={e => setEditedEvent(prev => ({ ...prev, createdBy: e.target.value }))} required>
          {users && users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4} isRequired>
        <FormLabel>Categories</FormLabel>
        <Stack pl={6} mt={1} spacing={1}>
          {categories.map(category => (
            <Checkbox
              key={category.id}
              isChecked={editedEvent.categoryIds.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              isRequired
            >
              {category.name}
            </Checkbox>
          ))}
        </Stack>
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
        Save
      </Button>
      <Button onClick={() => setIsEditing(false)}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </VStack>
  );
}

export default EventPage;
