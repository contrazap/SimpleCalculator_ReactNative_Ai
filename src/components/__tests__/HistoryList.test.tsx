import { fireEvent, render, screen } from '@testing-library/react-native';

import { HistoryList } from '@/components/HistoryList';

const entry = { id: 'a', expression: '2+3', result: '5', timestamp: 1 };

describe('HistoryList', () => {
  it('shows an empty state', async () => {
    await render(<HistoryList entries={[]} onSelect={jest.fn()} />);
    expect(screen.getByText('No calculations yet')).toBeTruthy();
  });

  it('selects an entry on press', async () => {
    const onSelect = jest.fn();
    await render(<HistoryList entries={[entry]} onSelect={onSelect} />);
    await fireEvent.press(screen.getByRole('button', { name: '2+3 equals 5' }));
    expect(onSelect).toHaveBeenCalledWith(entry);
  });
});
