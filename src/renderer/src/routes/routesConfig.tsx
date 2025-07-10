import { RouteObject } from 'react-router-dom';
import App from '../App';
import NoteCardList from '../components/NoteCardList';
import { ModalNoteForm } from '../components/NoteForm';
import ModalNoteCard from '@renderer/components/NoteCard/ModalNoteCard';

export const ROUTES = {
	HOME: '/',
	NOTES: '/notes',
	NOTE_CREATE: '/notes/new',
	NOTE_EDIT: (id: number) => `/notes/edit/${id}`,
} as const;

const routesConfig: RouteObject [] = [
	{
		path: ROUTES.HOME,
		element: <App />,
		children: [
			{
				index: true,
				element: <NoteCardList />,
			},
			{
				path: ROUTES.NOTES,
				element: <NoteCardList />,
				children: [
					{
						path: 'new',
						element: <ModalNoteForm action="Publish" />,
					},
					{
						path: `edit/:id`,
					    element: <ModalNoteForm action="Update" />,
					},
					{
						path: `:id`,
						element: <ModalNoteCard/>,
					},
				],
			},
		],
	},
];

export default routesConfig;
