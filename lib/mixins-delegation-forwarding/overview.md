Based on this excellent blog post http://raganwald.com/2014/04/10/mixins-forwarding-delegation.html

|  | Early-bound | Late-bound |
|----------------------|---------------|------------|
| Receiver’s context | Mixin | Delegation |
| Metaobject’s context | Private Mixin | Forwarding |

* Late binding property of delegation and forwarding allows for state pattern
  * Assign metaobject to a property of the receiver
  * Forward/delegate to metaobject property
  * Change metaobject to change state
