def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Create a hash map to store numbers and their indices
    seen = {}
    
    # Iterate through the array with index
    for i, num in enumerate(nums):
        # Calculate the complement we need to find
        complement = target - num
        
        # Check if we've already seen the complement
        if complement in seen:
            # If found, return both indices
            return [seen[complement], i]
        
        # Add current number and its index to our hash map
        seen[num] = i
    
    # The problem states there will always be a solution, so we shouldn't reach here
    return [] 