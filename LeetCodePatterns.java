import java.util.*;

/**
 * MASTER DSA PATTERNS - Java solutions with explanations.
 *
 * Sections: (a) Two Pointers  (b) Sliding Window  (c) Binary Search
 *           (d) Hash Map/Set  (e) Prefix Sum      (f) Stack/Monotonic Stack
 *           (g) Heap          (h) BFS/DFS         (i) DP    (j) Greedy
 *
 * Every method uses the LeetCode signature, so you can paste it into LeetCode.
 * n = input size. Complexities are noted per problem.
 */
public class LeetCodePatterns {

    // Helper data structures (LeetCode provides these)
    static class ListNode {
        int val; ListNode next;
        ListNode(int v) { val = v; }
    }

    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    // =====================================================================
    // (a) TWO POINTERS
    // Idea: two indices walk over the data (usually from both ends of a
    // sorted array, or a slow/fast pair) so a nested loop O(n^2) becomes O(n).
    // =====================================================================
    static class TwoPointers {

        /**
         * 11. Container With Most Water
         * Area = min(height[l], height[r]) * (r - l).
         * Start with the widest container. Moving the TALLER side can never
         * help (width shrinks, height is capped by the shorter side), so we
         * always move the SHORTER side hoping to find a taller line.
         * Time O(n), Space O(1).
         */
        public int maxArea(int[] height) {
            int l = 0, r = height.length - 1, best = 0;
            while (l < r) {
                int area = Math.min(height[l], height[r]) * (r - l);
                best = Math.max(best, area);
                if (height[l] < height[r]) l++;
                else r--;
            }
            return best;
        }

        /**
         * 15. 3Sum
         * Sort, then fix nums[i] and solve "Two Sum II" on the remainder
         * for a target of -nums[i]. Skip duplicates at every level so each
         * triplet appears once.
         * Time O(n^2), Space O(1) extra (ignoring output / sort).
         */
        public List<List<Integer>> threeSum(int[] nums) {
            List<List<Integer>> res = new ArrayList<>();
            Arrays.sort(nums);
            for (int i = 0; i < nums.length - 2; i++) {
                if (nums[i] > 0) break;                          // smallest > 0, sum can't be 0
                if (i > 0 && nums[i] == nums[i - 1]) continue;   // skip duplicate anchor
                int l = i + 1, r = nums.length - 1;
                while (l < r) {
                    int sum = nums[i] + nums[l] + nums[r];
                    if (sum < 0) l++;
                    else if (sum > 0) r--;
                    else {
                        res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                        l++; r--;
                        while (l < r && nums[l] == nums[l - 1]) l++;   // skip duplicates
                        while (l < r && nums[r] == nums[r + 1]) r--;
                    }
                }
            }
            return res;
        }

        /**
         * 167. Two Sum II - Input Array Is Sorted (1-indexed answer)
         * Sum too small -> need a bigger number -> move left up.
         * Sum too big   -> move right down.
         * Time O(n), Space O(1).
         */
        public int[] twoSum(int[] numbers, int target) {
            int l = 0, r = numbers.length - 1;
            while (l < r) {
                int sum = numbers[l] + numbers[r];
                if (sum == target) return new int[]{l + 1, r + 1};
                if (sum < target) l++;
                else r--;
            }
            return new int[]{-1, -1};
        }
    }

    // =====================================================================
    // (b) SLIDING WINDOW
    // Idea: maintain a window [left, right] over a sequence. Expand right,
    // shrink left when the window becomes invalid/too good. Each index enters
    // and leaves once -> O(n).
    // =====================================================================
    static class SlidingWindow {

        /**
         * 3. Longest Substring Without Repeating Characters
         * Map char -> last index seen. If the char is already inside the
         * window, jump left to just after its previous position.
         * Time O(n), Space O(min(n, alphabet)).
         */
        public int lengthOfLongestSubstring(String s) {
            Map<Character, Integer> last = new HashMap<>();
            int left = 0, best = 0;
            for (int right = 0; right < s.length(); right++) {
                char c = s.charAt(right);
                if (last.containsKey(c) && last.get(c) >= left) {
                    left = last.get(c) + 1;
                }
                last.put(c, right);
                best = Math.max(best, right - left + 1);
            }
            return best;
        }

        /**
         * 76. Minimum Window Substring
         * need[c] = how many of char c we still need (can go negative when
         * the window has extras). "missing" = total chars still needed.
         * Expand right until missing == 0 (window valid), then shrink left
         * as far as possible while it stays valid, recording the smallest.
         * Time O(n + m), Space O(1) (128-size array).
         */
        public String minWindow(String s, String t) {
            int[] need = new int[128];
            for (char c : t.toCharArray()) need[c]++;
            int missing = t.length();
            int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;

            for (int right = 0; right < s.length(); right++) {
                if (need[s.charAt(right)]-- > 0) missing--;      // this char was actually needed
                while (missing == 0) {                           // window is valid -> try to shrink
                    if (right - left + 1 < bestLen) {
                        bestLen = right - left + 1;
                        bestStart = left;
                    }
                    if (++need[s.charAt(left)] > 0) missing++;   // we just lost a needed char
                    left++;
                }
            }
            return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
        }

        /**
         * 209. Minimum Size Subarray Sum
         * All numbers are positive, so adding on the right increases the sum
         * and removing on the left decreases it - perfect for a window.
         * Time O(n), Space O(1).
         */
        public int minSubArrayLen(int target, int[] nums) {
            int left = 0, sum = 0, best = Integer.MAX_VALUE;
            for (int right = 0; right < nums.length; right++) {
                sum += nums[right];
                while (sum >= target) {
                    best = Math.min(best, right - left + 1);
                    sum -= nums[left++];
                }
            }
            return best == Integer.MAX_VALUE ? 0 : best;
        }
    }

    // =====================================================================
    // (c) BINARY SEARCH
    // Idea: if the search space is ordered (or has a monotonic yes/no
    // property), halve it each step -> O(log n).
    // Tip: use mid = l + (r - l) / 2 to avoid int overflow.
    // =====================================================================
    static class BinarySearch {

        /**
         * 704. Binary Search - the base template.
         * Time O(log n), Space O(1).
         */
        public int search(int[] nums, int target) {
            int l = 0, r = nums.length - 1;
            while (l <= r) {
                int mid = l + (r - l) / 2;
                if (nums[mid] == target) return mid;
                if (nums[mid] < target) l = mid + 1;
                else r = mid - 1;
            }
            return -1;
        }

        /**
         * 35. Search Insert Position
         * This is "lower bound": the first index whose value >= target.
         * Using [l, r) with r = length means the answer can be n (append).
         * Time O(log n).
         */
        public int searchInsert(int[] nums, int target) {
            return lowerBound(nums, target);
        }

        // first index i such that nums[i] >= target (or nums.length)
        private int lowerBound(int[] nums, int target) {
            int l = 0, r = nums.length;
            while (l < r) {
                int mid = l + (r - l) / 2;
                if (nums[mid] < target) l = mid + 1;
                else r = mid;
            }
            return l;
        }

        /**
         * 34. Find First and Last Position of Element in Sorted Array
         * first = lowerBound(target)
         * last  = lowerBound(target + 1) - 1  (the position just before the
         *         first element greater than target)
         * If first is out of range or doesn't hold target -> not present.
         * Time O(log n).
         */
        public int[] searchRange(int[] nums, int target) {
            int first = lowerBound(nums, target);
            if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
            int last = lowerBound(nums, target + 1) - 1;
            return new int[]{first, last};
        }

        /**
         * 33. Search in Rotated Sorted Array (distinct values)
         * After computing mid, at least ONE half is always sorted.
         * Identify the sorted half, check if target lies inside it, and
         * discard the other half accordingly.
         * Time O(log n).
         */
        public int searchRotated(int[] nums, int target) {
            int l = 0, r = nums.length - 1;
            while (l <= r) {
                int mid = l + (r - l) / 2;
                if (nums[mid] == target) return mid;

                if (nums[l] <= nums[mid]) {                        // left half sorted
                    if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                    else l = mid + 1;
                } else {                                           // right half sorted
                    if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                    else r = mid - 1;
                }
            }
            return -1;
        }
    }

    // =====================================================================
    // (d) HASH MAP / SET
    // Idea: trade memory for speed. O(1) average lookup removes inner loops.
    // =====================================================================
    static class HashMapSet {

        /**
         * 1. Two Sum
         * For each x, check whether (target - x) was already seen.
         * Time O(n), Space O(n).
         */
        public int[] twoSum(int[] nums, int target) {
            Map<Integer, Integer> seen = new HashMap<>();      // value -> index
            for (int i = 0; i < nums.length; i++) {
                int need = target - nums[i];
                if (seen.containsKey(need)) return new int[]{seen.get(need), i};
                seen.put(nums[i], i);
            }
            return new int[]{};
        }

        /**
         * 49. Group Anagrams
         * Anagrams share the same character counts. Build a key from the
         * 26 counts (avoids sorting each word).
         * Time O(n * k) where k = max word length, Space O(n * k).
         */
        public List<List<String>> groupAnagrams(String[] strs) {
            Map<String, List<String>> groups = new HashMap<>();
            for (String s : strs) {
                int[] count = new int[26];
                for (char c : s.toCharArray()) count[c - 'a']++;
                String key = Arrays.toString(count);           // e.g. "[1, 0, 0, ...]"
                groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
            }
            return new ArrayList<>(groups.values());
        }

        /**
         * 128. Longest Consecutive Sequence
         * Put all numbers in a set. Only start counting at a number that has
         * NO predecessor (num - 1 not in set), so each sequence is walked
         * exactly once -> O(n) overall.
         */
        public int longestConsecutive(int[] nums) {
            Set<Integer> set = new HashSet<>();
            for (int n : nums) set.add(n);
            int best = 0;
            for (int n : set) {
                if (!set.contains(n - 1)) {                    // start of a sequence
                    int cur = n, len = 1;
                    while (set.contains(cur + 1)) { cur++; len++; }
                    best = Math.max(best, len);
                }
            }
            return best;
        }

        /**
         * 217. Contains Duplicate
         * Set.add returns false if the element already existed.
         * Time O(n), Space O(n).
         */
        public boolean containsDuplicate(int[] nums) {
            Set<Integer> seen = new HashSet<>();
            for (int n : nums) {
                if (!seen.add(n)) return true;
            }
            return false;
        }

        /**
         * 242. Valid Anagram
         * Increment for s, decrement for t; all counts must end at zero.
         * Time O(n), Space O(1).
         */
        public boolean isAnagram(String s, String t) {
            if (s.length() != t.length()) return false;
            int[] count = new int[26];
            for (int i = 0; i < s.length(); i++) {
                count[s.charAt(i) - 'a']++;
                count[t.charAt(i) - 'a']--;
            }
            for (int c : count) if (c != 0) return false;
            return true;
        }
    }

    // =====================================================================
    // (e) PREFIX SUM
    // Idea: prefix[i] = sum of first i elements. Then sum(l..r) =
    // prefix[r+1] - prefix[l] in O(1). Combine with a HashMap to count
    // subarrays with a given property.
    // =====================================================================
    static class PrefixSum {

        /**
         * 303. Range Sum Query - Immutable  (likely the hidden first number)
         * Precompute once, answer each query in O(1).
         */
        static class NumArray {
            private final int[] prefix;
            public NumArray(int[] nums) {
                prefix = new int[nums.length + 1];
                for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
            }
            public int sumRange(int left, int right) {
                return prefix[right + 1] - prefix[left];
            }
        }

        /**
         * 560. Subarray Sum Equals K (negatives allowed -> no sliding window)
         * A subarray (j..i) sums to k when prefix[i] - prefix[j] = k, i.e.
         * prefix[j] = prefix[i] - k. Count how many earlier prefixes equal
         * that value. Seed the map with {0: 1} for subarrays starting at 0.
         * Time O(n), Space O(n).
         */
        public int subarraySum(int[] nums, int k) {
            Map<Integer, Integer> freq = new HashMap<>();
            freq.put(0, 1);
            int sum = 0, count = 0;
            for (int x : nums) {
                sum += x;
                count += freq.getOrDefault(sum - k, 0);
                freq.merge(sum, 1, Integer::sum);
            }
            return count;
        }

        /**
         * 724. Find Pivot Index
         * left sum == right sum, where right = total - left - nums[i].
         * Time O(n), Space O(1).
         */
        public int pivotIndex(int[] nums) {
            int total = 0;
            for (int x : nums) total += x;
            int left = 0;
            for (int i = 0; i < nums.length; i++) {
                if (left == total - left - nums[i]) return i;
                left += nums[i];
            }
            return -1;
        }

        /**
         * 974. Subarray Sums Divisible by K
         * Two prefixes with the SAME remainder mod k give a subarray whose
         * sum is divisible by k. Normalise negative remainders with
         * ((x % k) + k) % k. Count pairs of equal remainders.
         * Time O(n), Space O(k).
         */
        public int subarraysDivByK(int[] nums, int k) {
            int[] remCount = new int[k];
            remCount[0] = 1;                                   // empty prefix
            int sum = 0, count = 0;
            for (int x : nums) {
                sum = ((sum + x) % k + k) % k;
                count += remCount[sum];
                remCount[sum]++;
            }
            return count;
        }

        /**
         * 1480. Running Sum of 1d Array
         * Literally the prefix sum, done in place.
         */
        public int[] runningSum(int[] nums) {
            for (int i = 1; i < nums.length; i++) nums[i] += nums[i - 1];
            return nums;
        }
    }

    // =====================================================================
    // (f) STACK / MONOTONIC STACK
    // Monotonic stack: keep the stack sorted (increasing or decreasing).
    // When a new element breaks the order, pop and resolve those elements.
    // Each element is pushed/popped once -> O(n).
    // =====================================================================
    static class StackPatterns {

        /**
         * 20. Valid Parentheses
         * Push the EXPECTED closing bracket on every opener; on a closer it
         * must equal the top of the stack.
         */
        public boolean isValid(String s) {
            Deque<Character> stack = new ArrayDeque<>();
            for (char c : s.toCharArray()) {
                if (c == '(') stack.push(')');
                else if (c == '[') stack.push(']');
                else if (c == '{') stack.push('}');
                else if (stack.isEmpty() || stack.pop() != c) return false;
            }
            return stack.isEmpty();
        }

        /**
         * 84. Largest Rectangle in Histogram  (partly hidden in the image)
         * Keep a stack of indices with INCREASING heights. When a bar is
         * shorter than the top, the top bar can't extend further right:
         * pop it, its height is h, its width runs from the new stack top + 1
         * to i - 1. A sentinel height 0 at the end flushes the stack.
         * Time O(n), Space O(n).
         */
        public int largestRectangleArea(int[] heights) {
            Deque<Integer> stack = new ArrayDeque<>();
            int best = 0, n = heights.length;
            for (int i = 0; i <= n; i++) {
                int cur = (i == n) ? 0 : heights[i];
                while (!stack.isEmpty() && cur < heights[stack.peek()]) {
                    int h = heights[stack.pop()];
                    int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                    best = Math.max(best, h * width);
                }
                stack.push(i);
            }
            return best;
        }

        /**
         * 155. Min Stack - push, pop, top, getMin all O(1).
         * Second stack stores the running minimum at each depth.
         */
        static class MinStack {
            private final Deque<Integer> stack = new ArrayDeque<>();
            private final Deque<Integer> mins = new ArrayDeque<>();

            public void push(int val) {
                stack.push(val);
                mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
            }
            public void pop() { stack.pop(); mins.pop(); }
            public int top() { return stack.peek(); }
            public int getMin() { return mins.peek(); }
        }

        /**
         * 496. Next Greater Element I
         * Scan nums2 with a decreasing stack; when x is bigger than the top,
         * x is the "next greater" for that top. Store results in a map and
         * answer the nums1 queries from it.
         * Time O(n + m).
         */
        public int[] nextGreaterElement(int[] nums1, int[] nums2) {
            Map<Integer, Integer> next = new HashMap<>();
            Deque<Integer> stack = new ArrayDeque<>();
            for (int x : nums2) {
                while (!stack.isEmpty() && stack.peek() < x) next.put(stack.pop(), x);
                stack.push(x);
            }
            int[] res = new int[nums1.length];
            for (int i = 0; i < nums1.length; i++) res[i] = next.getOrDefault(nums1[i], -1);
            return res;
        }

        /**
         * 739. Daily Temperatures
         * Stack of INDICES with decreasing temperatures. A warmer day pops
         * colder days and fills in "days waited" = i - poppedIndex.
         * Time O(n), Space O(n).
         */
        public int[] dailyTemperatures(int[] temperatures) {
            int n = temperatures.length;
            int[] res = new int[n];
            Deque<Integer> stack = new ArrayDeque<>();
            for (int i = 0; i < n; i++) {
                while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                    int prev = stack.pop();
                    res[prev] = i - prev;
                }
                stack.push(i);
            }
            return res;
        }
    }

    // =====================================================================
    // (g) HEAP / PRIORITY QUEUE
    // Idea: get the min/max in O(1), insert/remove in O(log n).
    // "Top K" trick: keep a heap of size k of the OPPOSITE kind
    // (min-heap for k largest, max-heap for k smallest).
    // =====================================================================
    static class HeapPatterns {

        /**
         * 23. Merge k Sorted Lists
         * Min-heap holds the current head of each list. Poll the smallest,
         * append it, push its next node.
         * Time O(N log k), N = total nodes. Space O(k).
         */
        public ListNode mergeKLists(ListNode[] lists) {
            PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
            for (ListNode node : lists) if (node != null) pq.offer(node);
            ListNode dummy = new ListNode(0), tail = dummy;
            while (!pq.isEmpty()) {
                ListNode smallest = pq.poll();
                tail.next = smallest;
                tail = tail.next;
                if (smallest.next != null) pq.offer(smallest.next);
            }
            return dummy.next;
        }

        /**
         * 215. Kth Largest Element in an Array
         * Min-heap of size k: the root is always the kth largest so far.
         * Time O(n log k), Space O(k).
         * (Quickselect gives O(n) average if asked for a follow-up.)
         */
        public int findKthLargest(int[] nums, int k) {
            PriorityQueue<Integer> minHeap = new PriorityQueue<>();
            for (int x : nums) {
                minHeap.offer(x);
                if (minHeap.size() > k) minHeap.poll();
            }
            return minHeap.peek();
        }

        /**
         * 295. Find Median from Data Stream
         * lower = max-heap (smaller half), upper = min-heap (larger half).
         * Invariant: lower.size() == upper.size() or lower has one extra.
         * Median = top of lower (odd) or average of both tops (even).
         * addNum O(log n), findMedian O(1).
         */
        static class MedianFinder {
            private final PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder());
            private final PriorityQueue<Integer> upper = new PriorityQueue<>();

            public void addNum(int num) {
                lower.offer(num);
                upper.offer(lower.poll());                     // balance: biggest of lower goes up
                if (upper.size() > lower.size()) lower.offer(upper.poll());
            }
            public double findMedian() {
                if (lower.size() > upper.size()) return lower.peek();
                return (lower.peek() + upper.peek()) / 2.0;
            }
        }

        /**
         * 347. Top K Frequent Elements
         * Count frequencies, then keep a min-heap of size k ordered by
         * frequency. Time O(n log k).
         */
        public int[] topKFrequent(int[] nums, int k) {
            Map<Integer, Integer> freq = new HashMap<>();
            for (int x : nums) freq.merge(x, 1, Integer::sum);
            PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));
            for (int key : freq.keySet()) {
                heap.offer(key);
                if (heap.size() > k) heap.poll();
            }
            int[] res = new int[k];
            for (int i = 0; i < k; i++) res[i] = heap.poll();
            return res;
        }

        /**
         * 973. K Closest Points to Origin
         * Max-heap of size k ordered by squared distance (no sqrt needed).
         * When size exceeds k, evict the farthest point.
         * Time O(n log k).
         */
        public int[][] kClosest(int[][] points, int k) {
            PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
                (a, b) -> (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1]));
            for (int[] p : points) {
                maxHeap.offer(p);
                if (maxHeap.size() > k) maxHeap.poll();
            }
            return maxHeap.toArray(new int[0][]);
        }
    }

    // =====================================================================
    // (h) BFS / DFS
    // BFS (queue): level by level, shortest path in unweighted graphs.
    // DFS (recursion/stack): explore deep, connected components, flood fill.
    // =====================================================================
    static class GraphTraversal {

        /**
         * 102. Binary Tree Level Order Traversal
         * Queue; at each round process exactly queue.size() nodes = one level.
         * Time O(n), Space O(n).
         */
        public List<List<Integer>> levelOrder(TreeNode root) {
            List<List<Integer>> res = new ArrayList<>();
            if (root == null) return res;
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            while (!queue.isEmpty()) {
                int size = queue.size();
                List<Integer> level = new ArrayList<>();
                for (int i = 0; i < size; i++) {
                    TreeNode node = queue.poll();
                    level.add(node.val);
                    if (node.left != null) queue.offer(node.left);
                    if (node.right != null) queue.offer(node.right);
                }
                res.add(level);
            }
            return res;
        }

        /**
         * 127. Word Ladder
         * Words are nodes; an edge exists if they differ by one letter.
         * BFS from beginWord gives the shortest transformation length.
         * For each word try all 26 replacements per position and check the
         * dictionary set. Removing a word from the set marks it visited.
         * Time O(N * L * 26), N words of length L.
         */
        public int ladderLength(String beginWord, String endWord, List<String> wordList) {
            Set<String> dict = new HashSet<>(wordList);
            if (!dict.contains(endWord)) return 0;
            Queue<String> queue = new LinkedList<>();
            queue.offer(beginWord);
            dict.remove(beginWord);
            int steps = 1;
            while (!queue.isEmpty()) {
                int size = queue.size();
                for (int s = 0; s < size; s++) {
                    char[] cur = queue.poll().toCharArray();
                    for (int i = 0; i < cur.length; i++) {
                        char original = cur[i];
                        for (char c = 'a'; c <= 'z'; c++) {
                            if (c == original) continue;
                            cur[i] = c;
                            String next = new String(cur);
                            if (next.equals(endWord)) return steps + 1;
                            if (dict.remove(next)) queue.offer(next);   // true if it was unvisited
                        }
                        cur[i] = original;
                    }
                }
                steps++;
            }
            return 0;
        }

        /**
         * 994. Rotting Oranges - multi-source BFS
         * Start the queue with ALL rotten oranges at once. Each BFS level is
         * one minute. Track fresh count; if any fresh remain at the end, -1.
         * Time O(rows * cols).
         */
        public int orangesRotting(int[][] grid) {
            int rows = grid.length, cols = grid[0].length, fresh = 0;
            Queue<int[]> queue = new LinkedList<>();
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < cols; c++) {
                    if (grid[r][c] == 2) queue.offer(new int[]{r, c});
                    else if (grid[r][c] == 1) fresh++;
                }
            }
            int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
            int minutes = 0;
            while (!queue.isEmpty() && fresh > 0) {
                int size = queue.size();
                for (int i = 0; i < size; i++) {
                    int[] cell = queue.poll();
                    for (int[] d : dirs) {
                        int nr = cell[0] + d[0], nc = cell[1] + d[1];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                            grid[nr][nc] = 2;
                            fresh--;
                            queue.offer(new int[]{nr, nc});
                        }
                    }
                }
                minutes++;
            }
            return fresh == 0 ? minutes : -1;
        }

        /**
         * 200. Number of Islands - DFS flood fill
         * For every unvisited '1', count one island and "sink" the whole
         * island (set to '0') so it is never counted again.
         * Time O(rows * cols).
         */
        public int numIslands(char[][] grid) {
            int count = 0;
            for (int r = 0; r < grid.length; r++) {
                for (int c = 0; c < grid[0].length; c++) {
                    if (grid[r][c] == '1') {
                        count++;
                        sink(grid, r, c);
                    }
                }
            }
            return count;
        }

        private void sink(char[][] grid, int r, int c) {
            if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
            grid[r][c] = '0';
            sink(grid, r + 1, c);
            sink(grid, r - 1, c);
            sink(grid, r, c + 1);
            sink(grid, r, c - 1);
        }

        /**
         * 547. Number of Provinces
         * isConnected is an adjacency matrix. Count connected components:
         * for each unvisited city, run DFS and mark everything reachable.
         * Time O(n^2), Space O(n).
         */
        public int findCircleNum(int[][] isConnected) {
            int n = isConnected.length, provinces = 0;
            boolean[] visited = new boolean[n];
            for (int i = 0; i < n; i++) {
                if (!visited[i]) {
                    provinces++;
                    dfs(isConnected, visited, i);
                }
            }
            return provinces;
        }

        private void dfs(int[][] g, boolean[] visited, int city) {
            visited[city] = true;
            for (int next = 0; next < g.length; next++) {
                if (g[city][next] == 1 && !visited[next]) dfs(g, visited, next);
            }
        }
    }

    // =====================================================================
    // (i) DYNAMIC PROGRAMMING
    // Recipe: 1) define the state  2) write the recurrence
    //         3) set base cases    4) choose the order / optimise space.
    // =====================================================================
    static class DP {

        /**
         * 70. Climbing Stairs
         * State: ways(i) = ways(i-1) + ways(i-2) (last step was 1 or 2).
         * Only the last two values matter -> O(1) space.
         */
        public int climbStairs(int n) {
            if (n <= 2) return n;
            int prev2 = 1, prev1 = 2;
            for (int i = 3; i <= n; i++) {
                int cur = prev1 + prev2;
                prev2 = prev1;
                prev1 = cur;
            }
            return prev1;
        }

        /**
         * 198. House Robber
         * State: best(i) = max(best(i-1) [skip], best(i-2) + nums[i] [rob]).
         * Time O(n), Space O(1).
         */
        public int rob(int[] nums) {
            int skip = 0, take = 0;     // skip = best up to previous house, take = best up to two houses back
            for (int x : nums) {
                int newBest = Math.max(skip, take + x);
                take = skip;
                skip = newBest;
            }
            return skip;
        }

        /**
         * 300. Longest Increasing Subsequence - O(n log n)
         * tails[len] = smallest possible tail value of an increasing
         * subsequence of length len+1. For each x, binary search its
         * position: replace a tail, or extend if x is bigger than all.
         * (tails is NOT the actual subsequence, only its length is correct.)
         *
         * Simple O(n^2) version: dp[i] = 1 + max(dp[j]) for j < i, nums[j] < nums[i].
         */
        public int lengthOfLIS(int[] nums) {
            int[] tails = new int[nums.length];
            int size = 0;
            for (int x : nums) {
                int pos = Arrays.binarySearch(tails, 0, size, x);
                if (pos < 0) pos = -(pos + 1);                 // insertion point
                tails[pos] = x;
                if (pos == size) size++;
            }
            return size;
        }

        /**
         * 322. Coin Change - minimum coins (unbounded knapsack)
         * dp[a] = min coins to make amount a = 1 + min(dp[a - coin]).
         * "amount + 1" acts as infinity (can't need more coins than amount).
         * Time O(amount * coins), Space O(amount).
         */
        public int coinChange(int[] coins, int amount) {
            int[] dp = new int[amount + 1];
            Arrays.fill(dp, amount + 1);
            dp[0] = 0;
            for (int a = 1; a <= amount; a++) {
                for (int coin : coins) {
                    if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
                }
            }
            return dp[amount] > amount ? -1 : dp[amount];
        }

        /**
         * 1143. Longest Common Subsequence
         * dp[i][j] = LCS of the first i chars of a and first j chars of b.
         *   chars equal     -> dp[i][j] = dp[i-1][j-1] + 1
         *   chars different -> dp[i][j] = max(dp[i-1][j], dp[i][j-1])
         * Time O(m * n), Space O(m * n).
         */
        public int longestCommonSubsequence(String text1, String text2) {
            int m = text1.length(), n = text2.length();
            int[][] dp = new int[m + 1][n + 1];
            for (int i = 1; i <= m; i++) {
                for (int j = 1; j <= n; j++) {
                    if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
                    else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
            return dp[m][n];
        }
    }

    // =====================================================================
    // (j) GREEDY  (numbers partly hidden in the image: 45, 55, 134, 435, 763)
    // Idea: take the locally best choice each step; works when a local
    // optimum provably leads to the global optimum.
    // =====================================================================
    static class Greedy {

        /**
         * 45. Jump Game II - minimum number of jumps
         * Think in BFS "levels": curEnd is the farthest index reachable with
         * the current number of jumps, farthest is the best reach seen while
         * scanning. When we hit curEnd we must jump again.
         * Time O(n), Space O(1).
         */
        public int jump(int[] nums) {
            int jumps = 0, curEnd = 0, farthest = 0;
            for (int i = 0; i < nums.length - 1; i++) {
                farthest = Math.max(farthest, i + nums[i]);
                if (i == curEnd) {
                    jumps++;
                    curEnd = farthest;
                }
            }
            return jumps;
        }

        /**
         * 55. Jump Game - can we reach the last index?
         * Track the farthest reachable index; if i is beyond it, stuck.
         */
        public boolean canJump(int[] nums) {
            int farthest = 0;
            for (int i = 0; i < nums.length; i++) {
                if (i > farthest) return false;
                farthest = Math.max(farthest, i + nums[i]);
            }
            return true;
        }

        /**
         * 134. Gas Station
         * If total gas < total cost, impossible. Otherwise a unique start
         * exists: whenever the running tank drops below 0 at station i, no
         * station from the current start up to i can be the start, so the
         * next candidate is i + 1.
         * Time O(n), Space O(1).
         */
        public int canCompleteCircuit(int[] gas, int[] cost) {
            int total = 0, tank = 0, start = 0;
            for (int i = 0; i < gas.length; i++) {
                int diff = gas[i] - cost[i];
                total += diff;
                tank += diff;
                if (tank < 0) {
                    start = i + 1;
                    tank = 0;
                }
            }
            return total >= 0 ? start : -1;
        }

        /**
         * 435. Non-overlapping Intervals - minimum removals
         * Sort by END time and keep the interval that ends earliest, as it
         * leaves the most room for later ones. Removals = total - kept.
         * Time O(n log n).
         */
        public int eraseOverlapIntervals(int[][] intervals) {
            Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
            int kept = 1, end = intervals[0][1];
            for (int i = 1; i < intervals.length; i++) {
                if (intervals[i][0] >= end) {          // no overlap
                    kept++;
                    end = intervals[i][1];
                }
            }
            return intervals.length - kept;
        }

        /**
         * 763. Partition Labels
         * Record the last index of every letter. Scan, extending the current
         * partition end to cover the last occurrence of each letter seen.
         * When i reaches that end, cut the partition.
         * Time O(n), Space O(1).
         */
        public List<Integer> partitionLabels(String s) {
            int[] last = new int[26];
            for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
            List<Integer> res = new ArrayList<>();
            int start = 0, end = 0;
            for (int i = 0; i < s.length(); i++) {
                end = Math.max(end, last[s.charAt(i) - 'a']);
                if (i == end) {
                    res.add(end - start + 1);
                    start = i + 1;
                }
            }
            return res;
        }
    }

    // ---------------------------------------------------------------------
    // Quick sanity checks - run this file to see results.
    // ---------------------------------------------------------------------
    public static void main(String[] args) {
        System.out.println("11  maxArea        = " + new TwoPointers().maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));   // 49
        System.out.println("15  threeSum       = " + new TwoPointers().threeSum(new int[]{-1, 0, 1, 2, -1, -4}));         // [[-1,-1,2],[-1,0,1]]
        System.out.println("3   longestSubstr  = " + new SlidingWindow().lengthOfLongestSubstring("abcabcbb"));           // 3
        System.out.println("76  minWindow      = " + new SlidingWindow().minWindow("ADOBECODEBANC", "ABC"));              // BANC
        System.out.println("33  rotatedSearch  = " + new BinarySearch().searchRotated(new int[]{4, 5, 6, 7, 0, 1, 2}, 0)); // 4
        System.out.println("34  searchRange    = " + Arrays.toString(new BinarySearch().searchRange(new int[]{5, 7, 7, 8, 8, 10}, 8))); // [3, 4]
        System.out.println("128 longestConsec  = " + new HashMapSet().longestConsecutive(new int[]{100, 4, 200, 1, 3, 2})); // 4
        System.out.println("560 subarraySum    = " + new PrefixSum().subarraySum(new int[]{1, 2, 3}, 3));                  // 2
        System.out.println("84  largestRect    = " + new StackPatterns().largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3})); // 10
        System.out.println("739 dailyTemps     = " + Arrays.toString(new StackPatterns().dailyTemperatures(new int[]{73, 74, 75, 71, 69, 72, 76, 73}))); // [1,1,4,2,1,1,0,0]
        System.out.println("215 kthLargest     = " + new HeapPatterns().findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));   // 5
        System.out.println("200 numIslands     = " + new GraphTraversal().numIslands(new char[][]{
            {'1', '1', '0'}, {'0', '1', '0'}, {'0', '0', '1'}}));                                                          // 2
        System.out.println("322 coinChange     = " + new DP().coinChange(new int[]{1, 2, 5}, 11));                         // 3
        System.out.println("300 LIS            = " + new DP().lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18}));         // 4
        System.out.println("45  jump           = " + new Greedy().jump(new int[]{2, 3, 1, 1, 4}));                          // 2
        System.out.println("763 partitionLabels= " + new Greedy().partitionLabels("ababcbacadefegdehijhklij"));             // [9, 7, 8]
    }
}
