type Props = {
  handleChange: (value: string) => void,
  currentTab: string
}


const CustomerNavBar = ({
  handleChange,
  currentTab
}: Props) => {
  const subNavItems = [
    { id: 'Data Analytics', label: 'Data Analytics', active: true },
    { id: 'Recommendations', label: 'Recommendations', active: false },
    { id: 'Rule Based Recommendations', label: 'Rule Based Recommendations', active: false },
  ];

  return (
    <nav className="mt-2">
      <ul className="flex gap-1 border-b border-gray-200">
        {subNavItems.map((item) => (
          <li
            key={item.id}
            className={`relative ${item.label === currentTab ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <a
              // href={`#${item.id}`}
              className="block px-3 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50 rounded-lg"
              onClick={() => handleChange(item?.label)}
            >
              {item.label}{' '}
            </a>
            {item.label === currentTab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CustomerNavBar;