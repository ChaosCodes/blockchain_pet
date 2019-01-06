pragma solidity ^0.5.0;


contract pet {
    // 种类
    enum Variety { Golden, Teddy, Husky }
    // 记录狗狗的基本属性，代表一只狗狗
    struct Dog {
        uint8 age;
        uint8 health;
        uint8 hunger;
        Variety variety;
        string name;
    }
    // 代表一个用户的基本属性
    struct Master {
        bool hasPet;
        uint checktime;
        Dog dog;
    }

    // 好友系统
    struct Friends {
        address[] isfriends;
        address[] askfriends;
        address[] recept;
    }
    
    // 每个用户的数据表
    mapping(address => Master) users;
    // 每个用户的交友信息
    mapping(address => Friends) friends;

    // 对动物状态进行更新
    modifier grow() {
        Master storage master = users[msg.sender];
        require(master.hasPet, "The user has no pet!");
        uint duringTime = now - master.checktime;
        int count = 12;
        while (duringTime > 600) {
            duringTime -= 600;
            master.checktime += 600;
            
            // 降低宠物值
            master.dog.health -= 1;
            // 如果太饿了，则降低生命值
            if (master.dog.hunger < 2) {
                master.dog.hunger = 0;
                if (master.dog.health != 0) master.dog.health--;
            }
            else {
                master.dog.hunger -= 2;
            }
            // 如果很久没登录了当作离线2小时
            count--;
            if (count == 0) {
                master.checktime += duringTime;
                break;
            }
        }
        _;
    }

    // 判断调用者是否已经有宠物
    modifier hasPet() {
        Master storage master = users[msg.sender];
        require(master.hasPet, "The master has no pet!");
        _;
    }

    constructor () public {}

    // 创建狗狗
    function createPet(int8 _variety, string memory _name) public {
        Master storage master = users[msg.sender];
        require(!master.hasPet, "The user has had a pet!");
        master.checktime = now;
        master.hasPet = true;
        master.dog = Dog({
            age: 0,
            health: 100,
            hunger: 100,
            variety: Variety(_variety),
            name : _name
        });
    }

    // 为狗狗购买食物或药品
    function purchase(bool FoodOrMedicine) public payable hasPet {
        uint money = 10000;
        Master storage master = users[msg.sender];
        require(money == msg.value, "Pay wrong!");
        if (FoodOrMedicine) {
            master.dog.health += 50;
            if(master.dog.health > 100) master.dog.health = 100;
        } else {
            master.dog.hunger += 50;
            if(master.dog.hunger > 100) master.dog.hunger = 100;
        }
    }

    // 获取狗狗基本状态
    function getThePet() public grow returns(uint8, uint8, uint8, Variety, string memory) {
        Master storage master = users[msg.sender];
        return (master.dog.age, master.dog.health, master.dog.hunger, master.dog.variety, master.dog.name);
    }

    // 锻炼狗狗
    function exercise() public hasPet{
        Master storage master = users[msg.sender];
        require(master.dog.hunger >= 20, "Your pet is really hungry eat some food first.");
        // 运动结果
        master.dog.health += 10;
        if(master.dog.health > 100) master.dog.health = 100;
        master.dog.hunger -= 10;
    }


    /* 以下为好友方法 */

    // 判断用户是否在列表中
    function hasNotInFriend(address _friend, address[] memory _friends) private pure returns(bool) {
        for(uint i = 0; i < _friends.length; ++i) {
            if (_friend == _friends[i]) return false;
        }
        return true;
    }

    // 判断用户是否在好友列表中
    modifier hasfriend(address _friend) {
        Friends storage _friends = friends[msg.sender];
        require(hasNotInFriend(_friend, _friends.isfriends), "You have been friends");
        require(hasNotInFriend(_friend, _friends.askfriends), "You have asked yet");
        require(hasNotInFriend(_friend, _friends.recept), "The friend is in your recept list");
        _;
    }

    // 判断用户是否已经是好友
    modifier isfriend(address _friend) {
        Friends storage _friends = friends[msg.sender];
        require(!hasNotInFriend(_friend, _friends.isfriends), "You aren't friends");
        _;
    }



    // 添加好友
    function askforfriend(address friend) public hasfriend(friend) {
        require(users[msg.sender].hasPet, "You should have no pet first!");
        require(users[friend].hasPet, "Your friend has no pet!");
        require(friend != msg.sender, "You can't ask yourself!");
        friends[msg.sender].askfriends.push(friend);
        friends[friend].recept.push(msg.sender);
    }
    
    // 获取好友列表
    function getfriendlist() public view returns(address[] memory, address[] memory, address[] memory) {
        Friends memory _friends = friends[msg.sender];
        return (_friends.isfriends, _friends.askfriends, _friends.recept);
    }

    // 接受好友请求
    function acceptfriend(address friend) public {
        Friends storage _friends = friends[msg.sender];
        require(!hasNotInFriend(friend, _friends.recept), "The asker isn't in the recept list");
        _friends.isfriends.push(friend);
        // 删除recept里的记录
        for (uint i = 0; i < _friends.recept.length; ++i) {
            if (friend == _friends.recept[i]) {
                _friends.recept[i] = _friends.recept[_friends.recept.length - 1];
                delete _friends.recept[_friends.recept.length - 1];
                _friends.recept.length--;
                break;
            }
        }

        // 处理对方的好友信息
        Friends storage _friendfriends = friends[friend];
        _friendfriends.isfriends.push(msg.sender);

        // 删除ask里的记录
        for (uint i = 0; i < _friendfriends.askfriends.length; ++i) {
            if (friend == _friendfriends.askfriends[i]) {
                _friendfriends.askfriends[i] = _friendfriends.askfriends[_friendfriends.askfriends.length - 1];
                delete _friendfriends.askfriends[_friendfriends.askfriends.length - 1];
                _friendfriends.askfriends.length--;
                break;
            }
        }

    }
    
    // 为好友喂食
    function feedforFriend(address _friend) public payable isfriend(_friend) {
        uint money = 10000;
        Master storage master = users[_friend];
        require(_friend != msg.sender, "You can't feed yourself!");
        require(money == msg.value, "Pay wrong!");
        
        master.dog.hunger += 50;
        if(master.dog.hunger > 100) master.dog.hunger = 100;
    }

    // 获取好友宠物
    function getFriendPet(address _friend) public view isfriend(_friend) returns(uint8, uint8, uint8, Variety, string memory) {
        Master storage master = users[_friend];
        return (master.dog.age, master.dog.health, master.dog.hunger, master.dog.variety, master.dog.name);
    }

}
